import { Department } from "./department";
import { Certification } from "./certification";
import { User } from "./user";
import { ReportProject } from "./project";

type RDNote = {
  _id: string;
  text: string;
  dateAdded: Date;
  addedBy: Pick<User, "_id" | "name" | "email">;
};

type RDMetric = {
  _id: string;
  data: {
    origins_cpu_used: number;
    origins_cpu_available: number;
    origins_memory_used: number;
    origins_memory_available: number;
    origins_ceph_used: number;
    origins_ceph_available: number;
    origins_pods: number;
    origins_vms: number;
    origins_downtime: number;
    origins_outages: number;
    origins_mean_recovery_time: number;
    origins_node_status: string;
    origins_api_latency_internal: number;
    origins_ingress_latency_internal: number;
    origins_api_latency_external: number;
    origins_ingress_latency_external: number;
    //
    originsl1_cpu_used: number;
    originsl1_cpu_available: number;
    originsl1_memory_used: number;
    originsl1_memory_available: number;
    originsl1_flashsystem_used: number;
    originsl1_flashsystem_available: number;
    originsl1_pods: number;
    originsl1_downtime: number;
    originsl1_outages: number;
    originsl1_mean_recovery_time: number;
    originsl1_node_status: string;
    originsl1_api_latency_internal: number;
    originsl1_ingress_latency_internal: number;
    originsl1_api_latency_external: number;
    originsl1_ingress_latency_external: number;
    //
    ocp_cpu_used: number;
    ocp_cpu_available: number;
    ocp_memory_used: number;
    ocp_memory_available: number;
    ocp_ceph_used: number;
    ocp_ceph_available: number;
    ocp_pods: number;
    ocp_vms: number;
    //
    ceph_storage_used: number;
    ceph_storage_available: number;
    //
    flashsystem_storage_used: number;
    flashsystem_storage_available: number;
  };
};

interface RDReportData {
  kind: "r&d";
  projects: Array<ReportProject>;
  notes: RDNote[];
  metrics: RDMetric;
  certifications: Certification[];
}

type ReportStatus =
  | { status: "draft" }
  | { status: "published"; datePublished: Date };

interface GenericReport {
  _id: string;
  title: string;
  dateCreated: Date;
  coveringDates: { from: Date; to: Date };
  department: Pick<Department, "_id" | "title">;
}

type RDReport = RDReportData & ReportStatus & GenericReport;

export type Report = RDReport;
