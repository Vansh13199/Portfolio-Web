export interface CloudNode {
    id: string;
    name: string;
    provider: "aws" | "azure" | "gcp" | "k8s" | "cicd";
    icon: string;
    description: string;
    color: string;
    x: number;
    y: number;
}

export interface CloudConnection {
    from: string;
    to: string;
    label?: string;
}

export const cloudNodes: CloudNode[] = [
    {
        id: "aws-ec2",
        name: "EC2",
        provider: "aws",
        icon: "⚡",
        description: "Elastic Compute Cloud — scalable virtual servers",
        color: "#FF9900",
        x: 15,
        y: 25,
    },
    {
        id: "aws-s3",
        name: "S3",
        provider: "aws",
        icon: "🪣",
        description: "Simple Storage Service — object storage",
        color: "#FF9900",
        x: 10,
        y: 55,
    },
    {
        id: "aws-lambda",
        name: "Lambda",
        provider: "aws",
        icon: "λ",
        description: "Serverless compute — event-driven functions",
        color: "#FF9900",
        x: 22,
        y: 75,
    },
    {
        id: "azure-aks",
        name: "AKS",
        provider: "azure",
        icon: "☸",
        description: "Azure Kubernetes Service — managed K8s",
        color: "#0078D4",
        x: 40,
        y: 20,
    },
    {
        id: "azure-devops",
        name: "DevOps",
        provider: "azure",
        icon: "🔄",
        description: "Azure DevOps — CI/CD pipelines & repos",
        color: "#0078D4",
        x: 38,
        y: 60,
    },
    {
        id: "gcp-gke",
        name: "GKE",
        provider: "gcp",
        icon: "☸",
        description: "Google Kubernetes Engine — managed K8s",
        color: "#4285F4",
        x: 62,
        y: 30,
    },
    {
        id: "gcp-cloud-run",
        name: "Cloud Run",
        provider: "gcp",
        icon: "🚀",
        description: "Fully managed serverless containers",
        color: "#4285F4",
        x: 65,
        y: 65,
    },
    {
        id: "k8s-cluster",
        name: "Kubernetes",
        provider: "k8s",
        icon: "☸",
        description: "Container orchestration at scale",
        color: "#326CE5",
        x: 50,
        y: 45,
    },
    {
        id: "cicd-pipeline",
        name: "CI/CD",
        provider: "cicd",
        icon: "🔁",
        description: "Continuous Integration & Deployment pipeline",
        color: "#39ff14",
        x: 82,
        y: 40,
    },
    {
        id: "docker",
        name: "Docker",
        provider: "k8s",
        icon: "🐳",
        description: "Container runtime & image building",
        color: "#2496ED",
        x: 85,
        y: 70,
    },
    {
        id: "terraform",
        name: "Terraform",
        provider: "cicd",
        icon: "🏗️",
        description: "Infrastructure as Code — multi-cloud provisioning",
        color: "#7B42BC",
        x: 78,
        y: 15,
    },
];

export const cloudConnections: CloudConnection[] = [
    { from: "aws-ec2", to: "k8s-cluster", label: "deploy" },
    { from: "azure-aks", to: "k8s-cluster", label: "orchestrate" },
    { from: "gcp-gke", to: "k8s-cluster", label: "orchestrate" },
    { from: "k8s-cluster", to: "cicd-pipeline", label: "automate" },
    { from: "cicd-pipeline", to: "docker", label: "build" },
    { from: "docker", to: "k8s-cluster", label: "deploy" },
    { from: "terraform", to: "aws-ec2", label: "provision" },
    { from: "terraform", to: "azure-aks", label: "provision" },
    { from: "terraform", to: "gcp-gke", label: "provision" },
    { from: "azure-devops", to: "cicd-pipeline", label: "trigger" },
    { from: "aws-lambda", to: "aws-s3", label: "process" },
    { from: "gcp-cloud-run", to: "cicd-pipeline", label: "deploy" },
];

export const providerColors: Record<string, string> = {
    aws: "#FF9900",
    azure: "#0078D4",
    gcp: "#4285F4",
    k8s: "#326CE5",
    cicd: "#39ff14",
};
