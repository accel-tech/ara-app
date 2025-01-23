import {
  Modal,
  ModalVariant,
  FormGroup,
  FormSelect,
  FormSelectOption,
  ModalHeader,
  ModalBody,
} from "@patternfly/react-core";
import { FC, useEffect, useState } from "react";

type preferences = { theme: string };
export const UserPreferencesModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<preferences>(getSavedUserSettings());

  useEffect(() => {
    if (
      settings.theme === "dark" ||
      (settings.theme === "browser default" &&
        window.matchMedia("(prefers-color-scheme: dark)"))
    ) {
      document.querySelector("html")?.classList.add("pf-v6-theme-dark");
    } else {
      document.querySelector("html")?.classList.remove("pf-v6-theme-dark");
    }
  }, [settings]);

  function setSettingsPersistent(settings: preferences) {
    setSettings(settings);
    setSavedUserSettings(settings);
  }

  return (
    <Modal variant={ModalVariant.small} isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="User Preferences" />
      <ModalBody>
        <FormGroup label="Theme" fieldId="horizontal-form-title">
          <FormSelect
            id="theme-select"
            value={settings.theme}
            onChange={(_, theme) =>
              setSettingsPersistent({ ...settings, theme })
            }
          >
            {["light", "dark", "browser default"].map((option, index) => (
              <FormSelectOption key={index} value={option} label={option} />
            ))}
          </FormSelect>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
};

const savedSettingsKey = "saved-preferences";
function getSavedUserSettings(): preferences {
  let saved = localStorage.getItem(savedSettingsKey);
  try {
    if (!saved) saved = "{}";
    saved = JSON.parse(saved);
  } catch (err) {
    console.log(err);
  }

  return {
    // @ts-ignore
    theme: saved?.theme || "auto",
  };
}

function setSavedUserSettings(settings: preferences) {
  try {
    localStorage.setItem(savedSettingsKey, JSON.stringify(settings));
  } catch (err) {
    console.log(err);
  }
}
