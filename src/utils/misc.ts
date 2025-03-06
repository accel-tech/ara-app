import { Report } from "../types/report";

export const cl = (
  ...classNames: Array<string | { [key: string]: boolean } | undefined>
): string => {
  return classNames
    .map((className) => {
      if (typeof className === "undefined") return undefined;
      if (typeof className === "string") return className;

      const [key, condition] = Object.entries(className)[0];
      if (!condition) return undefined;

      return key;
    })
    .filter((val) => val)
    .join(" ");
};

export function concatWithoutDuplicates<T extends { _id: string }>(
  baseArray: T[],
  newDocs: T[]
) {
  const newArray = [...baseArray];

  newDocs.forEach((el) => {
    const index = newArray.findIndex((doc) => doc._id === el._id);
    if (index === -1) newArray.push(el);
    // replace old
    else newArray[index] = el;
  });

  return newArray;
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
export function capitalizeAllWords(val: string) {
  return val
    .split(" ")
    .reduce((final, curr) => final + " " + capitalizeFirstLetter(curr), "");
}

export function departmentToUrl(props: { category: string; title: string }) {
  return (
    "/" +
    urlizeString(props.category) +
    "/" +
    urlizeString(props.title.toLowerCase())
  );
}

export function urlizeString(str: string) {
  return str.toLowerCase().replace(/\s/g, "-");
}
export function unUrlizeString(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

// export function urlToDepartment(url: string) {
//   const parts = url.split("/");
//   const category = parts.length > 1 ? parts[1].replace(/-/g, " ") : "";
//   const title = parts.length > 2 ? parts[2].replace(/-/g, " ") : "";
//   return {
//     category,
//     title,
//   };
// }

export function dateToWeekRange(date: Date): {
  startOfWeek: Date;
  endOfWeek: Date;
} {
  const startOfWeek = new Date(date);
  const endOfWeek = new Date(date);

  const dayOfWeek = startOfWeek.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  endOfWeek.setDate(endOfWeek.getDate() + diffToMonday + 4);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    startOfWeek,
    endOfWeek,
  };
}

export function fmtDate1(
  date: Date,
  month?: "short" | "long",
  includeYear?: boolean
) {
  const options: Intl.DateTimeFormatOptions = {
    month: month || "short",
    day: "numeric",
    year: includeYear ? "numeric" : undefined,
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date(date)); // format to Jan. 29
}

export function fmtDate2(date: Date | string) {
  return new Date(date).toISOString().split("T")[0];
}

export function wait(ms = 2000) {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(undefined);
    }, ms);
  });
}

export function downtimeToUptimePercent(
  downtimeMinutes: number,
  timeRange: { from: Date; to: Date }
) {
  const totalMinutes =
    (new Date(timeRange.to).getTime() - new Date(timeRange.from).getTime()) /
    (1000 * 60);
  if (totalMinutes <= 0) return 0;

  const uptimeMinutes = Math.max(totalMinutes - downtimeMinutes, 0);
  return ((uptimeMinutes / totalMinutes) * 100).toFixed(1);
}

export function getPercentage(
  value1: number,
  value2: number,
  rounded?: boolean
) {
  const percent = (value1 / value2) * 100;
  if (rounded) return Math.ceil(percent);
  return percent;
}

export function fmtByteValue(gigabytes: number): string {
  const units = ["MB", "GB", "TB", "PB"];
  let size = gigabytes * 1024; // Start with MB
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1).replace(/\.0/, "")} ${units[unitIndex]}`;
}

export function getPercentOfNumber(
  number: number,
  percent: number,
  rounded?: boolean
) {
  const val = number * (percent / 100);
  if (rounded) return Math.ceil(val);
  return val;
}
// export function getDifferences(oldObj, newObj) {
//   let diff = {};
//   for (let key of [...new Set([...Object.keys(oldObj ?? {}), ...Object.keys(newObj ?? {})])]) {
//     switch (typeof newObj?.[key]) {
//       case "boolean":
//       case "number":
//       case "string":
//         if (!lodash.isEqual(oldObj?.[key], newObj?.[key])) {
//           diff[key] = newObj?.[key];
//         }
//         break;
//       case "object":
//         if (Array.isArray(newObj?.[key])) {
//           if (!lodash.isEqual(oldObj?.[key], newObj?.[key])) diff[key] = newObj[key];
//           break;
//         }
//         if (typeof newObj?.[key]?.getTime === "function") {
//           if (newObj[key].getTime() !== oldObj?.[key]?.getTime?.()) diff[key] = newObj[key];
//           break;
//         }
//         let subdiff = getDifferences(oldObj?.[key], newObj?.[key]);
//         if (Object.keys(subdiff).length > 0) diff[key] = subdiff;
//         break;
//       default:
//         console.log(`unandled type: ${typeof newObj?.[key]}`);
//         if (oldObj?.[key]) diff[key] = undefined;
//         break;
//     }
//   }

//   return diff;
// }

export const metricKeyInfoMap: Record<
  keyof Report["metrics"]["data"],
  { label: string; info?: string; unit?: string }
> = {
  origins_cpu_used: {
    label: "Origins CPU Used",
    info: "Amount of CPU currently used by origins",
    unit: "cores",
  },
  origins_cpu_available: {
    label: "Origins CPU Available",
    info: "Total CPU available for origins",
    unit: "cores",
  },
  origins_memory_used: {
    label: "Origins Memory Used",
    info: "RAM currently used by origins",
    unit: "GB",
  },
  origins_memory_available: {
    label: "Origins Memory Available",
    info: "Total RAM available for origins",
    unit: "GB",
  },
  origins_ceph_used: {
    label: "Origins Ceph Used",
    info: "Ceph storage used by origins",
    unit: "GB",
  },
  origins_ceph_available: {
    label: "Origins Ceph Available",
    info: "Ceph storage available for origins",
    unit: "GB",
  },
  origins_pods: {
    label: "Origins Pods",
    info: "Total number of pods running in origins",
    unit: "pods",
  },
  origins_vms: {
    label: "Origins VMs",
    info: "Total number of virtual machines in origins",
    unit: "VMs",
  },
  origins_downtime: {
    label: "Origins Downtime",
    info: "Total downtime experienced",
    unit: "minutes",
  },
  origins_outages: {
    label: "Origins Outages",
    info: "Number of outages experienced",
  },
  origins_mean_recovery_time: {
    label: "Origins Mean Recovery Time",
    info: "Average time to recover from outages",
    unit: "minutes",
  },
  origins_node_status: {
    label: "Origins Node Status",
    info: "Current status of nodes (e.g., healthy, degraded)",
  },
  origins_api_latency_internal: {
    label: "Origins Internal API Latency",
    info: "Latency of internal API requests",
    unit: "ms",
  },
  origins_ingress_latency_internal: {
    label: "Origins Internal Ingress Latency",
    info: "Latency of ingress traffic within the system",
    unit: "ms",
  },
  origins_api_latency_external: {
    label: "Origins External API Latency",
    info: "Latency of API requests from external sources",
    unit: "ms",
  },
  origins_ingress_latency_external: {
    label: "Origins External Ingress Latency",
    info: "Latency of ingress traffic from external sources",
    unit: "ms",
  },

  originsl1_cpu_used: {
    label: "Origins L1 CPU Used",
    info: "CPU usage in the L1 layer",
    unit: "cores",
  },
  originsl1_cpu_available: {
    label: "Origins L1 CPU Available",
    info: "Total CPU available in L1",
    unit: "cores",
  },
  originsl1_memory_used: {
    label: "Origins L1 Memory Used",
    info: "Memory used in L1 layer",
    unit: "GB",
  },
  originsl1_memory_available: {
    label: "Origins L1 Memory Available",
    info: "Total memory available in L1",
    unit: "GB",
  },
  originsl1_flashsystem_used: {
    label: "Origins L1 FlashSystem Used",
    info: "Flash storage used in L1",
    unit: "GB",
  },
  originsl1_flashsystem_available: {
    label: "Origins L1 FlashSystem Available",
    info: "Available flash storage in L1",
    unit: "GB",
  },
  originsl1_pods: {
    label: "Origins L1 Pods",
    info: "Total number of pods in L1",
    unit: "pods",
  },
  originsl1_downtime: {
    label: "Origins L1 Downtime",
    info: "Total downtime experienced in L1",
    unit: "minutes",
  },
  originsl1_outages: {
    label: "Origins L1 Outages",
    info: "Number of outages in L1",
  },
  originsl1_mean_recovery_time: {
    label: "Origins L1 Mean Recovery Time",
    info: "Average recovery time for L1 outages",
    unit: "minutes",
  },
  originsl1_node_status: {
    label: "Origins L1 Node Status",
    info: "Current node status in L1",
  },
  originsl1_api_latency_internal: {
    label: "Origins L1 Internal API Latency",
    info: "Internal API latency for L1",
    unit: "ms",
  },
  originsl1_ingress_latency_internal: {
    label: "Origins L1 Internal Ingress Latency",
    info: "Ingress latency for L1 internal traffic",
    unit: "ms",
  },
  originsl1_api_latency_external: {
    label: "Origins L1 External API Latency",
    info: "External API latency for L1",
    unit: "ms",
  },
  originsl1_ingress_latency_external: {
    label: "Origins L1 External Ingress Latency",
    info: "Ingress latency for L1 external traffic",
    unit: "ms",
  },

  ocp_cpu_used: {
    label: "OCP CPU Used",
    info: "CPU used by OpenShift",
    unit: "cores",
  },
  ocp_cpu_available: {
    label: "OCP CPU Available",
    info: "Total available CPU for OpenShift",
    unit: "cores",
  },
  ocp_memory_used: {
    label: "OCP Memory Used",
    info: "Memory used by OpenShift",
    unit: "GB",
  },
  ocp_memory_available: {
    label: "OCP Memory Available",
    info: "Total available memory for OpenShift",
    unit: "GB",
  },
  ocp_ceph_used: {
    label: "OCP Ceph Used",
    info: "Ceph storage used by OpenShift",
    unit: "GB",
  },
  ocp_ceph_available: {
    label: "OCP Ceph Available",
    info: "Ceph storage available for OpenShift",
    unit: "GB",
  },
  ocp_pods: {
    label: "OCP Pods",
    info: "Total pods running in OpenShift",
    unit: "pods",
  },
  ocp_vms: {
    label: "OCP VMs",
    info: "Total virtual machines in OpenShift",
    unit: "VMs",
  },

  ceph_storage_used: {
    label: "Ceph Storage Used",
    info: "Total Ceph storage used across the platform",
    unit: "GB",
  },
  ceph_storage_available: {
    label: "Ceph Storage Available",
    info: "Total available Ceph storage",
    unit: "GB",
  },

  flashsystem_storage_used: {
    label: "FlashSystem Storage Used",
    info: "Total FlashSystem storage used",
    unit: "GB",
  },
  flashsystem_storage_available: {
    label: "FlashSystem Storage Available",
    info: "Total available FlashSystem storage",
    unit: "GB",
  },
};
