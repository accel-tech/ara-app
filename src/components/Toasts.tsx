import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
} from "@patternfly/react-core";

export type ToastAlert = {
  key: number;
  text: string;
  variant?: "success" | "danger" | "warning" | "info";
  timeout?: number;
};
export function Toasts(props: {
  alerts: ToastAlert[];
  setAlerts: (alerts: ToastAlert[]) => void;
}) {
  function removeAlert(key: number) {
    props.setAlerts(props.alerts.filter((alert) => alert.key !== key));
  }

  return (
    <AlertGroup isToast isLiveRegion>
      {props.alerts.map((alert) => (
        <Alert
          key={alert.key}
          title={alert.text}
          variant={alert.variant}
          timeout={alert.timeout || 4000}
          onTimeout={() => removeAlert(alert.key)}
          actionClose={
            <AlertActionCloseButton
              title={alert.text}
              onClose={() => removeAlert(alert.key)}
            />
          }
        />
      ))}
    </AlertGroup>
  );
}
