# ALBA Concept Note

Version: June 28, 2026  
Language: English  
Status: Updated to reflect the current local prototype

## 1. Executive summary

**ALBA is a privacy-first, single-user web app that helps a person turn existing personal evidence into a Portable Human Portfolio, compare credible life and career scenarios, and activate one next step through practical choices rather than fixed labels.**

The current prototype is intentionally local, bilingual, and cautious:

- local-first
- no login
- no analytics
- no public cloud
- no real personal data in the shared demo
- every output framed as a signal, pattern, or hypothesis to validate

## 2. The problem ALBA addresses

Most people already have useful signals about how they work, what matters to them, and which directions may fit them. The problem is not total lack of information. The problem is fragmentation.

Relevant signals are usually spread across:

- CVs and profile exports
- certificates and learning artifacts
- feedback and achievements
- notes and personal stories
- health, wearable, and energy snapshots
- financial, relational, and lifestyle constraints

Most existing tools address only one slice of this picture. Journaling tools focus on daily writing. Personality tests compress complexity into static labels. Career tools often jump too quickly to matching. Clinical tools are designed for different purposes.

ALBA starts from a different premise:

**the goal is not to diagnose a person, but to help them build a more evidence-linked, portable, and actionable reading of themselves.**

## 3. Core product thesis

ALBA is built around five connected ideas:

1. Self-knowledge should begin with evidence that already exists.
2. A person needs a Portable Human Portfolio, not only a resume.
3. Future decisions should be tested as scenarios, not declared as identities.
4. Public taxonomies such as ESCO and O*NET are useful translation systems, not final truth systems.
5. Insight becomes valuable only when it translates into practical activation.

## 4. What ALBA is and what it is not

### ALBA is

- a local-first thinking and decision support environment
- a privacy-first prototype for organizing personal evidence
- a tool for life crafting and career crafting
- a bridge between self-knowledge and public opportunity language
- a system for moving from reflection to activation

### ALBA is not

- a journaling app
- a psychological test
- a clinical tool
- a traditional job matching engine
- a social platform

Every ALBA output should be presented as:

- a signal
- a pattern
- a working hypothesis
- a direction to validate in real life

Never as:

- a diagnosis
- a fixed identity
- a final truth

## 5. Current prototype position

The current build is a **shared empty-state prototype**.

That means:

- the full product structure is visible
- the information architecture is stable
- English and Italian keep the same structure
- the demo starts without personal uploads or user traces
- the prototype waits for real Phase 1 inputs before generating richer readings

This is important because the version used for sharing should explain the product clearly without exposing personal material.

## 6. The three-phase model

ALBA is organized around three phases.

### Phase 1. Awareness

The goal is to gather and structure what already exists.

Typical inputs:

- expressed skills
- latent skills
- strategic skills
- values, interests, and passions
- personal history, feedback, and achievements
- wellbeing baseline
- constraints and current context
- attachments and manual evidence entries

Typical outputs:

- a Portable Human Portfolio
- linked evidence
- cautious signals
- emerging patterns
- a provisional WHY hypothesis

### Phase 2. Simulation

The goal is to compare credible futures before committing to one.

Simulation in ALBA does **not** begin from job ads.

It begins from the Portable Human Portfolio and then:

1. translates the portfolio into ESCO and O*NET language
2. compares hypotheses through Ikigai
3. compares hypotheses through wellbeing targets and PERMAV
4. produces scenario-level readings rather than definitive role assignments

Typical outputs:

- translated skill and role families
- scenario hypotheses
- Ikigai positioning
- wellbeing-based sustainability filters
- multidimensional fit reasoning

### Phase 3. Activation

The goal is to turn the strongest scenario into movement.

In the updated concept, **opportunities live in Activation**, not in Simulation.

Simulation clarifies the translated hypothesis. Activation turns that into action.

Typical outputs:

- possible professional opportunities
- activation plans
- wellbeing routines
- learning paths
- portfolio projects
- experiments
- progressive lifestyle and work choices

## 7. The Portable Human Portfolio

The Portable Human Portfolio is the central artifact in ALBA.

It is broader than a CV and more operational than a personal narrative. It is designed to hold:

- expressed skills
- latent skills
- strategic skills
- guiding values
- interests and passions
- provisional WHY
- flow patterns
- wellbeing baseline
- personal constraints
- linked evidence

Its purpose is to create a reusable, evidence-linked base that can travel across scenario design, taxonomy translation, and activation decisions.

## 8. Simulation as ALBA's differentiator

The distinctive move in ALBA is not only gathering evidence. It is **using evidence to simulate futures in a structured way**.

In the current concept, Simulation performs three jobs:

### 1. Scenario comparison

ALBA compares possible directions as hypotheses.

Examples can include:

- job crafting in the current role
- a new role in people innovation or future of work
- a purpose-led side project

### 2. Taxonomy translation

ALBA translates the Portable Human Portfolio into shared public language.

This translation layer is designed to include:

- skill families
- knowledge areas
- role families
- work activities
- contextual signals

The prototype already frames this through ESCO and O*NET logic, even when some parts remain mock or fallback-driven.

### 3. Sustainability filtering

ALBA does not ask only whether a direction is interesting.

It also asks whether it appears:

- meaningful
- viable
- energizing
- compatible with the user's context
- compatible with the user's desired wellbeing profile

## 9. Opportunities in the updated model

In the updated ALBA concept, opportunities are **not** the input that drives the product.

They are a downstream result of the process.

The intended logic is:

1. collect evidence
2. build the Portable Human Portfolio
3. translate the portfolio into ESCO and O*NET terminology
4. compare hypotheses through Ikigai and wellbeing
5. surface possible opportunities as one activation lever

This is a strategic difference.

ALBA should not say:

> here is a job ad, therefore here is your direction

It should say:

> given the portfolio that is emerging, these are the role families and opportunity directions that currently seem most coherent with this hypothesis

## 10. Wellbeing and Ikigai inside decision-making

ALBA treats wellbeing and Ikigai as strategic filters, not decorative modules.

### Wellbeing

The concept uses two layers.

#### Layer 1. Ten concrete wellbeing domains

- physical / vitality
- mental / cognitive clarity
- emotional
- relational
- social / belonging
- spiritual / purpose
- intellectual / learning
- professional / contribution
- financial
- environment / lifestyle

Each domain includes:

- current level
- desired level
- priority
- gap
- activation need

#### Layer 2. PERMAV

- Positive Emotion
- Engagement / Flow
- Relationships
- Meaning
- Accomplishment
- Vitality

This allows ALBA to ask whether a scenario looks not only attractive, but also sustainable and flourishing-compatible.

### Ikigai

In ALBA, Ikigai is not a static test.

It is a dynamic scenario map built around:

- what I love
- what I am good at
- what the world needs
- what can sustain my life

Its role is to surface tensions and coherence, not to produce a simplistic answer.

## 11. Evidence intake and local attachment model

The prototype supports a local evidence intake flow.

This includes:

- manual evidence entries
- optional local attachments
- reusable intake across the rest of the journey

Attachments are treated as local inputs that may later support:

- patterns
- WHY
- Ikigai
- wellbeing
- skills translation
- opportunities
- experiments
- dossier export

The key rule is that these materials stay local and are interpreted cautiously.

## 12. Privacy and guardrails

Privacy is foundational to ALBA.

The current prototype follows these guardrails:

- no login
- no analytics
- no public cloud
- local SQLite database
- local storage in `vault/`
- local exports in `exports/`
- no real personal data in the shared demo build

Interpretive guardrails are equally important:

- no diagnosis
- no clinical framing
- no deterministic identity claims
- no "you are" language
- always prefer signals, patterns, and hypotheses

## 13. Bilingual and user-experience direction

The current prototype is designed to be:

- available in English and Italian
- structurally identical across both languages
- simple to navigate
- easier to use on both Mac and iPhone

The current direction favors:

- large tap targets
- simpler navigation
- a clearer three-phase flow
- reduced visual confusion
- a shareable infographic route for quick explanation

## 14. What the current prototype already demonstrates

The current local prototype already demonstrates:

- a navigable three-phase structure
- an empty-state shared demo
- bilingual structure
- evidence intake architecture
- wellbeing target logic
- Ikigai page architecture
- skill translation logic for Simulation
- opportunity positioning inside Activation
- experiments and dossier sections
- local export and local-storage principles
- a dummy digital twin intake agent concept

## 15. What is intentionally not implemented yet

Several parts remain intentionally incomplete in this sprint:

- no real AI reasoning layer yet
- no final Canonical Human Profile implementation
- no full ESCO-O*NET crosswalk
- no production-grade autonomous digital twin ingestion
- no deterministic role scoring engine
- no user account system
- no public-cloud deployment model

These absences are intentional.

The current goal is to validate the product structure, the logic of the three phases, and the clarity of the user journey before adding heavier intelligence layers.

## 16. Why this concept matters

Many people do not need more raw information.

They need:

- integration
- structure
- scenario comparison
- a bridge from self-knowledge to opportunity language
- a way to turn reflection into action

ALBA aims to solve exactly that gap.

Its deeper promise is not:

**find your perfect job**

Its deeper promise is:

**build a more truthful, portable, and actionable model of yourself, then use it to design a more coherent life and work direction**

## 17. Current concept summary

ALBA is currently best understood as a local-first concept for:

- organizing personal evidence
- building a Portable Human Portfolio
- translating that portfolio into public taxonomy language
- comparing credible life and career scenarios
- filtering those scenarios through wellbeing and Ikigai
- surfacing possible opportunities only after Simulation has done its job
- turning one selected direction into practical activation

That is the conceptual center of the current ALBA prototype.
