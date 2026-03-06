export interface K8sNode {
    id: string;
    type: "control-plane" | "worker" | "ingress";
    label: string;
    x: number;
    y: number;
    color: string;
    glowColor: string;
    details: string[];
    metrics: {
        cpu: number;
        memory: number;
        pods: number;
    };
}

export interface K8sPod {
    id: string;
    name: string;
    nodeId: string;
    service: string;
    status: "Running" | "Pending" | "CrashLoopBackOff";
    cpu: number;
    memory: number;
    color: string;
}

export interface K8sService {
    id: string;
    name: string;
    type: "ClusterIP" | "LoadBalancer" | "NodePort";
    targetPods: string[];
    port: number;
    color: string;
}

export interface K8sConnection {
    from: string;
    to: string;
    type: "control" | "traffic" | "service" | "ingress";
    animated: boolean;
}

export const controlPlane: K8sNode = {
    id: "control-plane",
    type: "control-plane",
    label: "Control Plane",
    x: 50,
    y: 12,
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.4)",
    details: ["API Server", "Scheduler", "Controller Manager", "etcd"],
    metrics: { cpu: 24, memory: 38, pods: 8 },
};

export const workerNodes: K8sNode[] = [
    {
        id: "worker-1",
        type: "worker",
        label: "Worker Node 1",
        x: 20,
        y: 42,
        color: "#00f0ff",
        glowColor: "rgba(0, 240, 255, 0.3)",
        details: ["kubelet", "containerd", "kube-proxy", "Calico CNI"],
        metrics: { cpu: 67, memory: 72, pods: 12 },
    },
    {
        id: "worker-2",
        type: "worker",
        label: "Worker Node 2",
        x: 50,
        y: 42,
        color: "#00f0ff",
        glowColor: "rgba(0, 240, 255, 0.3)",
        details: ["kubelet", "containerd", "kube-proxy", "Calico CNI"],
        metrics: { cpu: 45, memory: 58, pods: 9 },
    },
    {
        id: "worker-3",
        type: "worker",
        label: "Worker Node 3",
        x: 80,
        y: 42,
        color: "#00f0ff",
        glowColor: "rgba(0, 240, 255, 0.3)",
        details: ["kubelet", "containerd", "kube-proxy", "Calico CNI"],
        metrics: { cpu: 31, memory: 44, pods: 6 },
    },
];

export const pods: K8sPod[] = [
    { id: "pod-1", name: "api-gateway-7d8f9", nodeId: "worker-1", service: "api-gateway", status: "Running", cpu: 15, memory: 128, color: "#39ff14" },
    { id: "pod-2", name: "api-gateway-3k4l2", nodeId: "worker-2", service: "api-gateway", status: "Running", cpu: 12, memory: 120, color: "#39ff14" },
    { id: "pod-3", name: "user-svc-9a8b7", nodeId: "worker-1", service: "user-service", status: "Running", cpu: 22, memory: 256, color: "#4361ee" },
    { id: "pod-4", name: "user-svc-5c6d3", nodeId: "worker-2", service: "user-service", status: "Running", cpu: 18, memory: 240, color: "#4361ee" },
    { id: "pod-5", name: "payment-svc-1e2f", nodeId: "worker-3", service: "payment-service", status: "Running", cpu: 35, memory: 512, color: "#FF9900" },
    { id: "pod-6", name: "redis-cache-4g5h", nodeId: "worker-3", service: "redis", status: "Running", cpu: 8, memory: 64, color: "#ff6b6b" },
    { id: "pod-7", name: "monitoring-6i7j", nodeId: "worker-1", service: "prometheus", status: "Running", cpu: 28, memory: 384, color: "#ff00ff" },
    { id: "pod-8", name: "worker-svc-8k9l", nodeId: "worker-2", service: "worker-queue", status: "Running", cpu: 42, memory: 320, color: "#00d4aa" },
    { id: "pod-9", name: "nginx-ingress-0m1n", nodeId: "worker-3", service: "ingress", status: "Running", cpu: 5, memory: 48, color: "#326CE5" },
];

export const services: K8sService[] = [
    { id: "svc-gateway", name: "api-gateway", type: "LoadBalancer", targetPods: ["pod-1", "pod-2"], port: 443, color: "#39ff14" },
    { id: "svc-user", name: "user-service", type: "ClusterIP", targetPods: ["pod-3", "pod-4"], port: 8080, color: "#4361ee" },
    { id: "svc-payment", name: "payment-service", type: "ClusterIP", targetPods: ["pod-5"], port: 8081, color: "#FF9900" },
    { id: "svc-redis", name: "redis", type: "ClusterIP", targetPods: ["pod-6"], port: 6379, color: "#ff6b6b" },
];

export const ingressNode: K8sNode = {
    id: "ingress",
    type: "ingress",
    label: "Ingress Controller",
    x: 50,
    y: 78,
    color: "#39ff14",
    glowColor: "rgba(57, 255, 20, 0.3)",
    details: ["NGINX Ingress", "TLS Termination", "Rate Limiting", "Path Routing"],
    metrics: { cpu: 12, memory: 96, pods: 2 },
};

export const connections: K8sConnection[] = [
    { from: "control-plane", to: "worker-1", type: "control", animated: true },
    { from: "control-plane", to: "worker-2", type: "control", animated: true },
    { from: "control-plane", to: "worker-3", type: "control", animated: true },
    { from: "ingress", to: "worker-1", type: "ingress", animated: true },
    { from: "ingress", to: "worker-2", type: "ingress", animated: true },
    { from: "ingress", to: "worker-3", type: "ingress", animated: true },
    { from: "worker-1", to: "worker-2", type: "traffic", animated: false },
    { from: "worker-2", to: "worker-3", type: "traffic", animated: false },
];

export const scalingEvents = [
    { time: "2m ago", event: "HPA scaled api-gateway 2→3 replicas", type: "scale-up" },
    { time: "5m ago", event: "Pod payment-svc-1e2f restarted", type: "restart" },
    { time: "12m ago", event: "Node worker-3 joined cluster", type: "node-join" },
    { time: "18m ago", event: "HPA scaled user-service 3→2 replicas", type: "scale-down" },
];
