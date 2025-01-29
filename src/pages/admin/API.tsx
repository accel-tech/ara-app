import {
  Button,
  Checkbox,
  CodeBlock,
  CodeBlockCode,
  ExpandableSection,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  List,
  ListItem,
  ListVariant,
  PageSection,
  TextArea,
  TextInput,
  Title,
} from "@patternfly/react-core";
import { useFetch } from "../../hooks/useFetch";
import { useConfirmModal } from "../../components/ToolsWrapper";
import { useMemo, useState } from "react";

const presetGroups = [
  {
    title: "Departments",
    presets: [
      { label: "List Departments", route: "/departments", method: "GET" },
      { label: "Get Department", route: "/departments/:id", method: "GET" },
      {
        label: "Create Department",
        route: "/departments",
        method: "POST",
        body: JSON.stringify({
          title: "",
          category: "technical",
          reportKind: "r&d",
        }),
      },
      {
        label: "Edit Department",
        route: "/departments/:id",
        method: "PATCH",
        body: JSON.stringify({
          title: "",
          category: "technical",
          reportKind: "r&d",
        }),
      },
    ],
  },
];

export default function API() {
  const httpRequest = useFetch();

  const blank_fields = {
    route: "",
    method: "GET",
  };
  const [response, setResponse] = useState<string | undefined>(undefined);
  const [fields, setFields] = useState<{
    route: string;
    method: string;
    body?: string;
  }>(blank_fields);

  const [isLoading, setLoading] = useState(false);
  const confirmAction = useConfirmModal();

  const bodyIsValid = useMemo(() => {
    if (typeof fields.body !== "string") return true;
    try {
      JSON.stringify(JSON.parse(fields.body));
      return true;
    } catch (err) {
      return false;
    }
  }, [fields.body]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (fields.method !== "GET") {
      confirmAction({ onConfirm: sendRequest, confirmPrompt: "Are you sure?" });
    } else {
      sendRequest();
    }
  }

  async function sendRequest() {
    if (isLoading || !bodyIsValid || !fields.route || !fields.method) return;
    setResponse(undefined);
    setLoading(true);
    const headers = new Headers();

    const res = await httpRequest(fields.route, {
      headers,
      method: fields.method,
      body: fields.body ? fields.body : undefined,
    });
    setLoading(false);
    setResponse(JSON.stringify(res, null, 2));
  }

  return (
    <PageSection isFilled isCenterAligned hasBodyWrapper={false}>
      <Title headingLevel="h2">Manual API Requests</Title>
      <ExpandableSection toggleText="Sample API Requests">
        {presetGroups.map((group) => (
          <div key={group.title}>
            <Button variant="plain" isDisabled>
              {group.title}
            </Button>
            <List variant={ListVariant.inline}>
              {group.presets.map((preset) => (
                <ListItem key={preset.label}>
                  <Button
                    variant="link"
                    key={preset.label}
                    onClick={() =>
                      setFields({
                        route: preset.route,
                        method: preset.method,
                        body: preset.body,
                      })
                    }
                  >
                    {preset.label}
                  </Button>
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </ExpandableSection>

      <Form isHorizontal>
        <FormGroup label="Method" fieldId="horizontal-form-title">
          <FormSelect
            value={fields.method}
            onChange={(_, method) => setFields({ ...fields, method })}
            isDisabled={isLoading}
          >
            {["GET", "POST", "PATCH", "PUT", "DELETE"].map((option, index) => (
              <FormSelectOption key={index} value={option} label={option} />
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup label="Path">
          <TextInput
            isRequired
            type="text"
            id="modal-with-form-form-name"
            name="modal-with-form-form-name"
            placeholder="/path"
            value={fields.route}
            onChange={(_, route) => setFields({ ...fields, route })}
            isDisabled={isLoading}
          />
        </FormGroup>

        {typeof fields.body === "string" && (
          <FormGroup label="Body">
            <TextArea
              value={fields.body}
              onChange={(_e, body) => setFields({ ...fields, body })}
              isDisabled={isLoading}
              validated={bodyIsValid ? "default" : "error"}
              resizeOrientation="vertical"
              className="min-h-[200px]"
              autoResize
            ></TextArea>
          </FormGroup>
        )}
        <Checkbox
          id="useBody"
          label="Send JSON body"
          isChecked={typeof fields.body === "string"}
          onChange={(_e, isChecked) =>
            setFields({ ...fields, body: isChecked ? "{}" : undefined })
          }
          isDisabled={isLoading}
        />
      </Form>

      <Form style={{ maxHeight: 600, overflowY: "scroll" }}>
        <FormGroup label="Response" fieldId="horizontal-form-title">
          <CodeBlock style={{ minHeight: 300 }}>
            <CodeBlockCode id="code-content">{response}</CodeBlockCode>
          </CodeBlock>
        </FormGroup>
      </Form>
      <Button variant="control" isLoading={isLoading} onClick={handleSubmit}>
        Send
      </Button>
    </PageSection>
  );
}
