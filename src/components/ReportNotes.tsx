import { FC, Fragment, useState } from "react";
import { Report } from "../types/report";
import {
  Alert,
  Button,
  Icon,
  List,
  ListItem,
  Panel,
  TextInput,
} from "@patternfly/react-core";
import {
  BullhornIcon,
  CircleIcon,
  MinusIcon,
  PlusIcon,
} from "@patternfly/react-icons";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";
import { useFetch } from "../hooks/useFetch";
import { typedUseStoreActions, typedUseStoreState } from "../store";
import { useToast } from "./ToolsWrapper";
import { InlineEditTextInput } from "./InlineEditTextInput";

export const ReportNotes: FC<{
  reportId: string;
  status: Report["status"];
  notes: Report["notes"];
  departmentId: string;
}> = ({ reportId, status, notes, departmentId }) => {
  const [blankFields, setBlankFields] = useState<null | { text: string }>(null);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setLoading] = useState(false);

  const access = useDepartmentAccess(departmentId);
  const user = typedUseStoreState((state) => state.auth.user)!;
  const patchDocument = typedUseStoreActions(
    (actions) => actions.reports.patchDocument
  );

  const httpRequest = useFetch();

  function addNote() {
    setBlankFields({ text: "" });
  }

  function cancelAdd() {
    setBlankFields(null);
    setError(null);
  }

  async function handleAdd() {
    if (isLoading) return;
    if (!blankFields?.text) return;
    setLoading(true);
    setError(null);
    const { data, error } = await httpRequest<{ _id: string; text: string }>(
      `/reports/${reportId}/notes`,
      {
        method: "POST",
        body: JSON.stringify(blankFields),
      }
    );
    setLoading(false);
    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }

    if (data && Object.keys(data).length > 0) {
      setBlankFields(null);
      patchDocument({
        _id: reportId,
        fields: {
          notes: [
            ...notes,
            {
              _id: data._id,
              text: data.text,
              dateAdded: new Date(),
              addedBy: { _id: user._id, name: user.name, email: user.email },
            },
          ],
        },
      });
    }
  }

  async function deleteNote(noteId: string) {
    if (isLoading) return;

    patchDocument({
      _id: reportId,
      fields: {
        notes: notes.filter((note) => note._id !== noteId),
      },
    });
    setLoading(true);
    const { error } = await httpRequest(
      `/reports/${reportId}/notes/${noteId}`,
      { method: "DELETE" }
    );
    setLoading(false);
    if (error) {
      console.log(error);
      // showToast();

      patchDocument({
        _id: reportId,
        fields: {
          notes: notes, // value is the same on function execution,
        },
      });
    }
  }

  async function editNote(args: { _id: string; text: string }) {
    if (isLoading) return;

    patchDocument({
      _id: reportId,
      fields: {
        notes: notes.map((note) =>
          note._id !== args._id ? note : { ...note, text: args.text }
        ),
      },
    });
    setLoading(true);
    const { error } = await httpRequest(
      `/reports/${reportId}/notes/${args._id}`,
      { method: "PATCH", body: JSON.stringify({ text: args.text }) }
    );
    setLoading(false);
    if (error) {
      console.log(error);
      // showToast();

      patchDocument({
        _id: reportId,
        fields: {
          notes: notes, // value is the same on function execution,
        },
      });
    }
  }

  if (status === "draft") {
    return (
      <div>
        {notes.length > 0 && (
          <ul style={{ marginBottom: 10 }}>
            {notes.map((note) => (
              <li
                key={note._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: 5,
                }}
              >
                <InlineEditTextInput
                  actualValue={note.text}
                  onSave={(text) => editNote({ _id: note._id, text })}
                  onDelete={() => deleteNote(note._id)}
                  isDisabled={note.addedBy._id !== user._id}
                  isDeletable
                />
              </li>
            ))}
          </ul>
        )}
        {blankFields && (
          <Panel variant="raised" style={{ padding: 10 }}>
            <div style={{ display: "flex", columnGap: 5 }}>
              <TextInput
                value={blankFields.text}
                onChange={(_e, text) =>
                  setBlankFields({ ...blankFields, text })
                }
                isDisabled={isLoading}
                autoFocus
              />
              <Button
                variant="link"
                onClick={handleAdd}
                // isLoading={isLoading ? true : undefined} // it changes default size when isLoading is defined
                isDisabled={isLoading}
              >
                Save
              </Button>
              <Button
                variant="link"
                isDanger
                onClick={cancelAdd}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
            </div>
            {error && (
              <p style={{ color: "red" }}>
                <Alert variant="danger" isInline isPlain title={error} />{" "}
              </p>
            )}
          </Panel>
        )}
        {(access === "lead" || access === "member") && !blankFields && (
          <Button
            variant="link"
            icon={<PlusIcon />}
            onClick={addNote}
            isDisabled={isLoading}
          >
            Add Note
          </Button>
        )}
      </div>
    );
  }
  if (status === "published") {
    return (
      <div>
        <p>form to update</p>
      </div>
    );
  }

  return <></>;
};
