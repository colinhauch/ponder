# Specification System for AI-Assisted Development

## Purpose and Philosophy

This directory contains specification documents that serve as persistent context for AI-assisted development. The primary purpose is to bridge the gap between conversations where AI coding assistants excel at detailed implementation but struggle to maintain architectural coherence across sessions. Specifications provide the necessary context for agents to understand system architecture, design decisions, and feature relationships without requiring complete codebase analysis in every conversation.

The specification system assumes a development workflow where AI agents receive the README, recent git changes, and conversation history as context. From this information, agents should be able to identify when specifications need creation or updates, then produce or modify specification documents that maintain system coherence. Specifications are living documents that evolve with the codebase, not static design artifacts that become outdated.

## Core Principles for AI Agents

When working with this specification system, agents should understand that specifications exist to capture architectural decisions, system relationships, and implementation patterns that would otherwise require deep codebase analysis to discover. Each specification documents a feature or system component at a level of detail sufficient for an agent to make informed decisions about changes without introducing architectural conflicts or duplicating existing functionality.

Agents reading these specifications should prioritize understanding the relationships between components, the rationale behind design decisions, and the concrete implementation details like database schemas and API signatures. The specifications are optimized for agent consumption through long-form prose that provides context and reasoning, rather than bullet points that require human interpretation of implicit connections.

## When to Create or Update Specifications

Agents should create new specifications when git changes introduce a feature or system component that represents a cohesive architectural element. A new specification is warranted when the feature involves multiple files, introduces new database tables or API endpoints, or establishes patterns that other features will follow. Simple bug fixes or minor enhancements to existing features should instead trigger updates to existing specifications rather than creating new documents.

Updates to existing specifications become necessary when implementation diverges from documented behavior, when new capabilities are added to existing features, or when architectural decisions change. Agents should treat specification updates as essential maintenance, not optional documentation tasks. A specification that no longer matches implementation actively harms development by providing misleading context.

## Specification Numbering and Organization

Documents use sequential two-digit prefixes (01_, 02_, 03_) that indicate the chronological order of feature development. This numbering provides historical context about which features build upon earlier work. When creating a new specification, agents should examine existing numbers and select the next available number in sequence. The numbering reflects development history rather than logical grouping, acknowledging that related features may be implemented at different times.

File names follow snake_case convention with descriptive titles that clearly identify the feature without requiring additional context. A good specification name enables an agent to determine relevance from the filename alone. For example, "04_live_edit_pvc.md" immediately signals that the document covers live editing functionality related to persistent volume claims, while a vague name like "04_editing.md" would require opening the file to understand its scope.

## Document Structure for Agent Consumption

Specifications follow a hierarchical heading structure where Level 1 contains the title with number and feature name, Level 2 contains major conceptual sections, Level 3 provides detailed subsections and implementation specifics, and Level 4 captures fine-grained details and sub-processes. This structure enables agents to quickly scan for relevant sections while maintaining enough depth for complete understanding.

Agents should write specifications in readable paragraphs that explain both implementation details and the reasoning behind decisions. Bullet points should appear only for reference information like configuration options, state lists, or enumerated alternatives. The paragraph format embeds relationships and causality that bullet points obscure, making it easier for agents to understand how components interact and why certain approaches were chosen.

## Essential Content Elements

Every specification should begin with a problem statement or overview that establishes why the feature exists and what user need it addresses. This context prevents agents from suggesting changes that solve implementation problems while breaking the feature's purpose. Following the overview, specifications should detail the actual implementation through concrete elements like database schemas, API signatures, configuration flags, and code patterns.

Where relevant, specifications should document state machines with both state definitions and transition rules, explain security and testing considerations, and include tables that organize reference information like environment variables or configuration options. The goal is to provide sufficient detail that an agent can make informed decisions about modifications without needing to read source code, while remaining concise enough that the entire specification fits comfortably in context windows.

Specifications should include cross-references to related documents using relative markdown links. These references help agents understand feature dependencies and discover related context without explicit instruction. When documenting alternatives that were considered but rejected, include the reasoning for rejection to prevent agents from suggesting the same approaches in future conversations.

## Workflow for Agents Creating Specifications

When git changes suggest that a new specification is needed, agents should first scan existing specifications to understand naming patterns, structural conventions, and the level of detail expected. The agent should identify the next available number in sequence and choose a descriptive snake_case filename. Before writing, the agent should determine which existing specifications relate to the new feature and plan appropriate cross-references.

The specification content should begin with a clear problem statement explaining why the feature exists, followed by architecture and implementation sections that provide concrete details. Agents should include actual schemas, configuration examples, and code patterns from the implementation rather than describing them abstractly. Tables should organize reference information that agents will need to consult repeatedly. The document should conclude with any testing, security, or future considerations relevant to the feature.

After drafting the specification, agents should verify that cross-references use correct relative paths and that technical details match the actual implementation visible in git changes. The specification should be comprehensive enough that another agent could understand the feature's architecture and make modifications without reading source code, while remaining focused enough that the entire document can be consumed in a single context window.

## Workflow for Agents Updating Specifications

When git changes modify an existing feature, agents should identify which specification documents cover that feature by examining filenames and scanning document overviews. Updates should maintain the document's existing structure and writing style while incorporating new implementation details, changed behaviors, or additional capabilities. Agents should not simply append new information but should integrate it into appropriate sections, potentially restructuring content if the changes substantially alter the feature's architecture.

Updates should preserve historical design decisions and alternative considerations unless they are no longer relevant. If implementation has diverged from documented alternatives, agents should update the reasoning to reflect current understanding. Configuration tables, state definitions, and schema examples must exactly match current implementation to prevent agents from making decisions based on outdated information.

## Maintaining System Coherence

As specifications accumulate, agents should watch for signs that documents need reorganization or consolidation. If multiple specifications repeatedly reference the same concepts, consider whether a foundational specification should be extracted to capture shared architecture. If a specification grows beyond roughly 3000 words, consider whether it covers multiple features that should be separated.

Agents should treat specifications as authoritative for architectural decisions but recognize that they may lag behind implementation. When specification and code conflict, agents should assume the code is correct and update the specification accordingly. The specification system succeeds when agents can make informed architectural decisions from specifications alone, consulting code only to verify implementation details.

## Quality Standards

Specifications should be written in clear technical prose that explains both mechanism and motivation. Avoid vague descriptions like "the system handles authentication" in favor of specific details like "authentication uses JWT tokens stored in httpOnly cookies with 24-hour expiration." Include metric names, flag names, table names, and field names from actual implementation to ground the specification in concrete reality.

Code examples should use actual language syntax and real variable names from the codebase rather than pseudocode or generic placeholders. Tables should organize reference information in a format that agents can quickly scan. Cross-references should point to specific sections in related documents when possible. The specification should be comprehensive enough to prevent architectural mistakes while remaining focused enough to be consumed efficiently.

## Common Pitfalls to Avoid

Agents should not create specifications for trivial features that involve single-file changes or simple utility functions. Such features belong in code comments or inline documentation rather than separate specification documents. Avoid creating specifications that simply describe what the code does without explaining architectural decisions or design rationale. The specification should answer "why" questions that code alone cannot address.

Do not let specifications become outdated by treating them as initial design documents rather than living documentation. When making code changes that affect specification content, updating the specification is part of the development task, not optional follow-up work. Avoid bullet-point-heavy specifications that read like meeting notes rather than technical documentation. The paragraph format, while more verbose, provides essential context about relationships and causality.

## Integration with Development Process

This specification system assumes a development workflow where agents receive context through the README, git diffs showing recent changes, and conversation history. From this context, agents should proactively identify when specifications need creation or updates as part of their normal development assistance. Creating or updating specifications is not a separate documentation phase but an integral part of feature development.

Specifications serve both AI agents and human developers, so they must be readable by both audiences. Humans review and edit specifications as markdown files, making corrections or additions based on their understanding. Agents read specifications to quickly understand feature architecture and make informed decisions about changes. This dual audience requires specifications to be technically precise while remaining readable as prose.

The system succeeds when an agent can begin a new conversation, read relevant specifications, understand the architectural context, and make informed suggestions about changes without requiring extensive codebase analysis or conversation history. Specifications reduce the context burden on each conversation while maintaining architectural coherence across development sessions.