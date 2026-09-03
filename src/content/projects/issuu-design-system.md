---
title: "Issuu — Design System"
company: Issuu
role: "Design Systems — growth layer (acquisition & activation)"
timeframe: "2023"
summary: "Building and maintaining the design system that powers Issuu’s product surfaces."
tags: ["Design system", "Foundations", "Scale"]
order: 1
featured: true
accent: "#F05A28"
thumb: /work/issuu-design-system/tile.png
cover: /work/issuu-design-system/01.png
---

## Context

Issuu is a web-based publishing platform used by creators and businesses to transform PDFs into interactive content such as flipbooks, articles, and social media assets.

The platform ecosystem includes several distinct surfaces:

- a high-traffic marketing website
- pricing and payment flows
- a multi-step onboarding experience
- a feature-rich flipbook editing tool used by creators
Over time, these areas had evolved independently.

Marketing pages were designed separately from the product interface, while growth experiments often introduced temporary UI patterns that later diverged from the main product.

This resulted in inconsistent interfaces and fragmented user journeys.

At the same time, growth teams needed to run continuous experiments across pricing, onboarding, and activation flows.

Without a shared system, each experiment required rebuilding UI elements from scratch.

This slowed iteration and created increasing design debt.

We needed a s calable design system that could unify the entire funnel and support rapid experimentation.


![](/work/issuu-design-system/02.png)


## The Problem

An internal UI audit revealed four key issues:

1. Visual Drift

Marketing pages and product UI had evolved independently, leading to inconsistent typography, spacing, and component styles.

2. Experimentation Friction

Growth experiments frequently required creating new UI patterns rather than reusing structured components.

3. Component Duplication

Similar components, such as buttons, pricing cards, and form elements, were implemented multiple times with slight variations.

4. Scaling Complexity

As more designers and engineers joined the team, inconsistencies multiplied without governance.

The result was:

- slower iteration cycles
- inconsistent user experiences
- increased cognitive load for users
- growing design and engineering maintenance costs

## My Role

Silkscreen was co-created collaboratively between design and engineering.

I worked with another designer to define the system architecture and component structure.

My primary responsibility was the growth layer of the system, covering the acquisition and activation funnel.

Components and patterns I owned included:

- homepage modules
- pricing comparison tables
- plan selection cards
- payment flows
- onboarding steps
- activation patterns
- navigation header and footer
- alignment between marketing pages and the flipbook editor UI
I also worked closely with marketing, product managers, and engineers to ensure consistent implementation across the product.


## Foundations & Architecture

Silkscreen was built on a scalable architecture designed to align design and engineering workflows.

Key foundations included:

- Design tokens shared between Figma and GitHub
- Figma variables for scalable design decisions
- standardized spacing scale
- unified typography system
- color tokens aligned with brand
- elevation and border-radius tokens
These foundations allowed the system to act as a single source of truth across design and code.


## Component Architecture

Silkscreen was structured into three layers:

Foundations

Design tokens controlling color, spacing, typography, elevation, and radius.

Core Components

Reusable building blocks used across the product:

- buttons
- inputs
- dropdowns
- modals
- alerts
- tooltips
- cards
Growth Patterns

Reusable structures used specifically in the growth funnel:

- pricing comparison tables
- plan selection modules
- onboarding step layouts
- progress indicators
- upsell banners
- hero modules
This layered structure enabled rapid experimentation while maintaining visual consistency.


## Governance & Collaboration

To ensure the system remained scalable, we established a governance model.

We held a weekly Silkscreen meeting with designers and engineers.

Designers proposing new components had to:

- present the use case
- demonstrate reusability
- confirm alignment with existing tokens
- collaborate with engineers on naming conventions
Once approved, components were documented and added to the system.

We also maintained a dedicated documentation website that included:

- component usage guidelines
- interaction rules
- implementation references
- design principles
This governance structure prevented duplication and ensured the system remained consistent.


## Unifying Growth & Product

Before Silkscreen, users often experienced a visual disconnect between acquisition pages and the core product.

Example journey:

Homepage → Pricing → Onboarding → Flipbook Tool

Each step previously used slightly different UI patterns.

Silkscreen unified these experiences by introducing shared components across both marketing and product surfaces.

This eliminated the visual “handoff shock” when users moved from acquisition pages into the product.

Issuu's Price Page Before:


![](/work/issuu-design-system/03.png)

Issuu's Price Page after:

Payment Screen before:

Payment Screen after:

Issuu's Creator Homepage before:


![](/work/issuu-design-system/04.png)

Issuu's Creator Homepage after:

Issuu's Creator's Workspace before:

Issuu's Creator's Workspace after:


## Other Key Screens:

Homepage:


![](/work/issuu-design-system/05.png)

Preview Tool before Signup:


![](/work/issuu-design-system/06.png)

Sign up for Teams:

Example screen from the Onboarding flow:


## Enabling Faster Experimentation

Because my role focused heavily on growth initiatives, experimentation was a core requirement.

Silkscreen allowed us to:

- reuse structured components across experiments
- modify token values without rebuilding UI
- maintain consistency while testing variations
- reduce design-to-development clarification cycles
Instead of rebuilding UI for each experiment, we iterated at the system level.

This significantly accelerated experimentation velocity. ​​​​​​​

Upsell Modal using already made components:


## Adoption & Evolution

Within months, Silkscreen became the default foundation for:

- growth experiments
- onboarding improvements
- pricing updates
- secondary marketing pages
New features were expected to use existing components unless reviewed in governance sessions.

Over time we refined:

- component naming conventions
- token structure
- documentation clarity
- interaction patterns
The system evolved alongside the product.


## Impact

Silkscreen delivered measurable improvements across the product organization.

It enabled:

- faster iteration cycles for growth experiments
- improved UI consistency across marketing and product
- reduced duplication of UI components
- stronger collaboration between design and engineering
- more structured experimentation
Most importantly, it created a stable foundation that allowed teams to focus on meaningful product improvements rather than rebuilding UI repeatedly.

From a growth point of view:

Radical increase in users sharing their published documents within first 7 days of account creation.

Radical increase in usage of key features.

A fully-operational design system and a complete redesign of our platform’s interface.

A fully-integrated design team supporting the work of eight cross-functional delivery teams distributed across three countries.

Improved design processes and improved overall UX maturity across the entire organization.

Issuu’s most successful revenue year in history was also the year that we shipped the most design improvements to the product.

Closing the gap between a new user’s first publish and first share:

Testimonials:


## Lessons Learned

Building Silkscreen reinforced several key principles:

- A design system is infrastructure, not decoration
- Governance prevents entropy
- Tokens enable scalable experimentation
- Design and engineering alignment is essential
- Systems must evolve alongside product strategy
Silkscreen ultimately became the connective layer between acquisition, activation, and product experience.
