export interface InfraNode {
    id: string;
    provider: "aws" | "azure" | "gcp";
    service: string;
    icon: string;
    category: "compute" | "storage" | "database" | "serverless" | "container" | "network" | "cicd";
    description: string;
    config: string[];
    x: number;
    y: number;
    color: string;
}

export interface InfraConnection {
    from: string;
    to: string;
    label: string;
    protocol: string;
    animated: boolean;
    color: string;
}

export interface InfraRegion {
    provider: "aws" | "azure" | "gcp";
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    nodes: string[]; // node ids
    x: number;
    y: number;
    width: number;
    height: number;
}

export const infraNodes: InfraNode[] = [
    // AWS
    {
        id: "aws-ec2", provider: "aws", service: "EC2", icon: "⚡",
        category: "compute", description: "Elastic Compute Cloud",
        config: ["t3.xlarge", "4 vCPU / 16GB", "us-east-1a", "Auto Scaling Group"],
        x: 12, y: 22, color: "#FF9900",
    },
    {
        id: "aws-s3", provider: "aws", service: "S3", icon: "🪣",
        category: "storage", description: "Object Storage",
        config: ["Standard tier", "Versioning enabled", "Cross-region replication", "Lifecycle policies"],
        x: 8, y: 45, color: "#FF9900",
    },
    {
        id: "aws-lambda", provider: "aws", service: "Lambda", icon: "λ",
        category: "serverless", description: "Serverless Functions",
        config: ["Node.js 20.x", "512MB memory", "30s timeout", "Event-driven triggers"],
        x: 16, y: 68, color: "#FF9900",
    },
    {
        id: "aws-rds", provider: "aws", service: "RDS", icon: "🗄️",
        category: "database", description: "Managed PostgreSQL",
        config: ["db.r6g.large", "Multi-AZ", "100GB gp3", "Automated backups"],
        x: 24, y: 45, color: "#FF9900",
    },
    {
        id: "aws-eks", provider: "aws", service: "EKS", icon: "☸",
        category: "container", description: "Elastic Kubernetes",
        config: ["v1.28", "3 node groups", "Fargate profiles", "Cluster autoscaler"],
        x: 12, y: 90, color: "#FF9900",
    },

    // Azure
    {
        id: "azure-vm", provider: "azure", service: "Virtual Machines", icon: "🖥️",
        category: "compute", description: "Azure VMs",
        config: ["Standard_D4s_v3", "4 vCPU / 16GB", "East US", "Availability Set"],
        x: 42, y: 22, color: "#0078D4",
    },
    {
        id: "azure-aks", provider: "azure", service: "AKS", icon: "☸",
        category: "container", description: "Azure Kubernetes",
        config: ["v1.28", "System + User pools", "Azure CNI", "Managed identity"],
        x: 38, y: 45, color: "#0078D4",
    },
    {
        id: "azure-storage", provider: "azure", service: "Storage", icon: "📦",
        category: "storage", description: "Blob Storage",
        config: ["StorageV2", "Hot tier", "GRS replication", "Private endpoints"],
        x: 52, y: 45, color: "#0078D4",
    },
    {
        id: "azure-functions", provider: "azure", service: "Functions", icon: "⚙️",
        category: "serverless", description: "Azure Functions",
        config: ["Consumption plan", ".NET 8", "HTTP triggers", "Service Bus bindings"],
        x: 45, y: 68, color: "#0078D4",
    },

    // GCP
    {
        id: "gcp-compute", provider: "gcp", service: "Compute Engine", icon: "🔧",
        category: "compute", description: "GCP VMs",
        config: ["e2-standard-4", "4 vCPU / 16GB", "us-central1", "Instance groups"],
        x: 75, y: 22, color: "#4285F4",
    },
    {
        id: "gcp-run", provider: "gcp", service: "Cloud Run", icon: "🚀",
        category: "serverless", description: "Managed Containers",
        config: ["Fully managed", "Auto-scaling 0-100", "Concurrency: 80", "2nd gen execution"],
        x: 72, y: 45, color: "#4285F4",
    },
    {
        id: "gcp-storage", provider: "gcp", service: "Cloud Storage", icon: "☁️",
        category: "storage", description: "Object Storage",
        config: ["Multi-regional", "Standard class", "Object lifecycle", "IAM policies"],
        x: 85, y: 45, color: "#4285F4",
    },
    {
        id: "gcp-gke", provider: "gcp", service: "GKE", icon: "☸",
        category: "container", description: "Google Kubernetes",
        config: ["v1.28 Autopilot", "Multi-zone", "Workload identity", "Binary Authorization"],
        x: 78, y: 68, color: "#4285F4",
    },

    // Cross-cloud
    {
        id: "cdn", provider: "aws", service: "CloudFront", icon: "🌐",
        category: "network", description: "CDN Edge Network",
        config: ["200+ edge locations", "HTTP/3", "WAF integration", "Origin Shield"],
        x: 50, y: 8, color: "#ff6b6b",
    },
    {
        id: "cicd", provider: "gcp", service: "CI/CD Pipeline", icon: "🔄",
        category: "cicd", description: "Multi-Cloud CI/CD",
        config: ["GitHub Actions", "Terraform Cloud", "ArgoCD", "SonarQube scanning"],
        x: 50, y: 88, color: "#39ff14",
    },
];

export const infraConnections: InfraConnection[] = [
    { from: "cdn", to: "aws-ec2", label: "Route traffic", protocol: "HTTPS", animated: true, color: "#ff6b6b" },
    { from: "cdn", to: "azure-vm", label: "Route traffic", protocol: "HTTPS", animated: true, color: "#ff6b6b" },
    { from: "cdn", to: "gcp-compute", label: "Route traffic", protocol: "HTTPS", animated: true, color: "#ff6b6b" },
    { from: "aws-ec2", to: "aws-rds", label: "Query", protocol: "TCP:5432", animated: true, color: "#FF9900" },
    { from: "aws-ec2", to: "aws-s3", label: "Store assets", protocol: "HTTPS", animated: false, color: "#FF9900" },
    { from: "aws-lambda", to: "aws-s3", label: "Process", protocol: "SDK", animated: true, color: "#FF9900" },
    { from: "azure-aks", to: "azure-storage", label: "Persist", protocol: "HTTPS", animated: true, color: "#0078D4" },
    { from: "azure-vm", to: "azure-aks", label: "Orchestrate", protocol: "TCP:6443", animated: true, color: "#0078D4" },
    { from: "gcp-compute", to: "gcp-run", label: "Route", protocol: "gRPC", animated: true, color: "#4285F4" },
    { from: "gcp-run", to: "gcp-storage", label: "Store", protocol: "HTTPS", animated: false, color: "#4285F4" },
    { from: "cicd", to: "aws-eks", label: "Deploy", protocol: "kubectl", animated: true, color: "#39ff14" },
    { from: "cicd", to: "azure-aks", label: "Deploy", protocol: "kubectl", animated: true, color: "#39ff14" },
    { from: "cicd", to: "gcp-gke", label: "Deploy", protocol: "kubectl", animated: true, color: "#39ff14" },
    { from: "aws-eks", to: "aws-ec2", label: "Schedule", protocol: "Internal", animated: false, color: "#FF9900" },
    { from: "gcp-gke", to: "gcp-compute", label: "Schedule", protocol: "Internal", animated: false, color: "#4285F4" },
];

export const infraRegions: InfraRegion[] = [
    {
        provider: "aws", label: "AWS (us-east-1)", color: "#FF9900",
        bgColor: "rgba(255, 153, 0, 0.03)", borderColor: "rgba(255, 153, 0, 0.12)",
        nodes: ["aws-ec2", "aws-s3", "aws-lambda", "aws-rds", "aws-eks"],
        x: 2, y: 14, width: 32, height: 84,
    },
    {
        provider: "azure", label: "Azure (East US)", color: "#0078D4",
        bgColor: "rgba(0, 120, 212, 0.03)", borderColor: "rgba(0, 120, 212, 0.12)",
        nodes: ["azure-vm", "azure-aks", "azure-storage", "azure-functions"],
        x: 34, y: 14, width: 24, height: 64,
    },
    {
        provider: "gcp", label: "GCP (us-central1)", color: "#4285F4",
        bgColor: "rgba(66, 133, 244, 0.03)", borderColor: "rgba(66, 133, 244, 0.12)",
        nodes: ["gcp-compute", "gcp-run", "gcp-storage", "gcp-gke"],
        x: 66, y: 14, width: 28, height: 64,
    },
];

export const providerMetrics = {
    aws: { instances: 12, containers: 48, cost: "$2,340/mo", uptime: "99.97%" },
    azure: { instances: 8, containers: 32, cost: "$1,870/mo", uptime: "99.95%" },
    gcp: { instances: 6, containers: 24, cost: "$1,550/mo", uptime: "99.99%" },
};
