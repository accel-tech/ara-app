import { Banner, Content } from "@patternfly/react-core";

export const AppEnvironemntBanner = () => {
  const app_version = import.meta.env.VITE_APP_ENVIRONMENT;
  if (!app_version) {
    return (
      <Banner
        className="flex justify-center items-center text-base h-[35px]"
        color="blue"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 35,
        }}
      >
        <p>
          You are currently experiencing a{" "}
          <span className="font-semibold">Tech Preview</span> version of this
          application.
        </p>
      </Banner>
    );
  }

  if (app_version != "production") {
    return (
      <Banner
        className="flex justify-center items-center text-base h-[35px]"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 35,
        }}
        color={app_version === "development" ? "purple" : "orange"}
      >
        <Content className="!text-gray-700">
          You are currently experiencing this application in{" "}
          <span className="capitalize text-black">{app_version}</span> mode.
        </Content>
      </Banner>
    );
  }

  return <></>;
};
