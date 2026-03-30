import {
  FunctionDeclarationSchemaType,
  type FunctionDeclarationsTool,
  type FunctionDeclaration,
  VertexAI
} from "@google-cloud/vertexai";

const DEFAULT_MODEL = "gemini-2.0-flash-001";
const DEFAULT_LOCATION = "us-central1";

type VertexAgentToolManifest = {
  declarations: FunctionDeclaration[];
  tool: FunctionDeclarationsTool;
};

export type VertexAgentDefinition = {
  name: string;
  description: string;
  model: string;
  location: string;
  project: string | null;
  systemInstruction: string;
  tools: VertexAgentToolManifest[];
  toolNames: string[];
  hasClient: boolean;
};

export type VertexAgentChatResult = {
  reply: string;
  agent: Pick<
    VertexAgentDefinition,
    "name" | "model" | "location" | "project" | "toolNames" | "hasClient"
  >;
};

const initialFunctionDeclarations: FunctionDeclaration[] = [
  {
    name: "lookup_linkedin_profile",
    description:
      "Find a LinkedIn profile or company page for a named person or organization.",
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        subjectName: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Full person or company name to look up."
        },
        subjectType: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "The target type to search for.",
          enum: ["person", "company"]
        }
      },
      required: ["subjectName", "subjectType"]
    }
  },
  {
    name: "research_company_context",
    description:
      "Collect high-level company context that can be used to tailor outreach or follow-up messaging.",
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        companyName: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "The company to research."
        },
        focusArea: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Optional research angle such as hiring, product, or industry."
        }
      },
      required: ["companyName"]
    }
  },
  {
    name: "draft_outreach_message",
    description:
      "Generate a first-pass LinkedIn outreach or follow-up message using structured prospect context.",
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        recipientName: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Name of the message recipient."
        },
        companyName: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Recipient's company, if known."
        },
        objective: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Why the message is being sent."
        },
        tone: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Desired writing style.",
          enum: ["professional", "friendly", "direct"]
        }
      },
      required: ["recipientName", "objective"]
    }
  }
];

const initialToolset: VertexAgentToolManifest[] = [
  {
    declarations: initialFunctionDeclarations,
    tool: {
      functionDeclarations: initialFunctionDeclarations
    }
  }
];

function getProjectId(): string | null {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.GCLOUD_PROJECT;
  return projectId && projectId.trim().length > 0 ? projectId : null;
}

function buildSystemInstruction(): string {
  return [
    "You are the LinkedInAgent assistant running on Vertex AI.",
    "Use tools when they materially improve factual accuracy or message quality.",
    "If a required tool is not implemented yet, say so clearly instead of inventing results."
  ].join(" ");
}

export function createVertexAgentDefinition(): VertexAgentDefinition {
  const project = getProjectId();
  const location = process.env.VERTEX_AI_LOCATION ?? DEFAULT_LOCATION;
  const model = process.env.VERTEX_AI_MODEL ?? DEFAULT_MODEL;

  let hasClient = false;

  if (project !== null) {
    new VertexAI({
      project,
      location
    });
    hasClient = true;
  }

  return {
    name: "linkedin-agent",
    description: "Initial Vertex AI agent configuration for LinkedIn prospecting workflows.",
    model,
    location,
    project,
    systemInstruction: buildSystemInstruction(),
    tools: initialToolset,
    toolNames: initialFunctionDeclarations.map((tool) => tool.name),
    hasClient
  };
}

export function createVertexAgentChatResult(message: string): VertexAgentChatResult {
  const agent = createVertexAgentDefinition();

  return {
    reply: agent.hasClient
      ? `Vertex agent '${agent.name}' is configured. Tool execution is not implemented yet, so this is a placeholder response to: ${message}`
      : `Vertex agent '${agent.name}' is configured, but GOOGLE_CLOUD_PROJECT is not set. Tool execution is not implemented yet, so this is a placeholder response to: ${message}`,
    agent: {
      name: agent.name,
      model: agent.model,
      location: agent.location,
      project: agent.project,
      toolNames: agent.toolNames,
      hasClient: agent.hasClient
    }
  };
}
