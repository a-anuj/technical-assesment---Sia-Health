# SIA Health – Technical Assignment

## Overview
This project implements a structured validation and interpretation system for a client meal plan.  
The goal is **not nutritional perfection**, but to demonstrate:
- Logical reasoning
- Clear separation of rule-based checks and AI-assisted interpretation
- Thoughtful presentation of insights



## Approach

The solution is divided into **three conceptual layers**:

### 1. Data Normalization

The raw meal plan data cannot be used directly for validation because its structure is inconsistent and time-dependent.

**What the raw data looks like**
- Meals are grouped under time-based keys (e.g., `breakfast_9_10_am`, `eveningSnack_5_pm`)
- The same logical meal appears under different names
- Day-wise data is fragmented across multiple objects

**What normalization does**
- Converts the raw data into a uniform structure:
  - Day → Meals → Text description
- Maps all time-based meal keys into standard meal categories:
  - `breakfast`
  - `lunch`
  - `dinner`
  - `midMorningSnack`
  - `eveningSnack`
- Ensures every day follows the same schema

**Why this is required**
- Allows rule-based checks to iterate reliably over meals
- Decouples validation logic from input format
- Makes the system resilient to future meal plan formats

---


### 2. Quality Check 1 – Rule-Based Validation
This check uses **deterministic logic** to validate meal plan quality.

#### Protein Coverage Check
- Detects presence of protein sources using keyword heuristics
- Evaluates coverage across breakfast, lunch, dinner and evening snacks.
- Produces:
  - Coverage percentage
  - Protein status (`OK`, `Warning`, `Needs Improvement`)
  - Detected protein sources

#### Portion Clarity Check
- Detects explicit quantity indicators (e.g., grams, bowls, cups)
- Computes how many meals define portion sizes clearly
- Outputs coverage metrics and a qualitative status

**Why rule-based?**
- Transparent
- Fast
- Repeatable
- Easy to justify and debug

---

### 3. Quality Check 2 – AI-Assisted Plan Fit
This check answers a **different question**:

> Even if a plan looks good structurally, is it a reasonable fit for **this** client?

Instead of recalculating nutrition, the AI:
- Receives **pre-computed metrics**
- Receives **client health context**
- Interprets alignment and potential contradictions

The AI output is:
- Structured (JSON)
- Limited in scope
- Explicitly constrained by rules

---

### 4. Human Interpretation 
AI output is **not shown blindly**.

A final interpretation layer:
- Cross-validates AI observations with known client context
- Highlights nuances that pure metrics cannot capture
- Clearly separates:
  - Quantitative validation
  - AI reasoning
  - Human judgment

This layer exists to demonstrate **responsible AI usage**.


## Assumptions Made

- Protein detection is **heuristic**, not gram-accurate
- Presence of protein sources implies *reasonable* intake for structural validation
- Portion clarity is inferred from common measurement keywords
- Health conditions are interpreted contextually, not clinically
- AI insights are advisory, not authoritative

These assumptions are documented and intentional.


## AI Prompt Logic (Quality Check 2)

The AI-assisted plan fit check is designed to **interpret**, not compute, nutritional quality.

The prompt is structured with the following logic:

#### 1. Role Definition
The AI is explicitly instructed to act as a *health-coaching assistant*.
This constrains the tone and scope of the output.

#### 2. Separation of Responsibilities
The prompt clearly states that all meal plan metrics are:
- Pre-computed
- Verified
- Not open to reinterpretation

This ensures the AI does **not**:
- Recalculate protein
- Challenge rule-based logic
- Invent missing nutritional data

#### 3. Context Injection
Two types of context are provided:
- **Quantitative context:** Protein coverage, portion clarity, detected sources
- **Qualitative context:** Client health history and reported patterns

This allows the AI to reason about *fit* rather than *accuracy*.

#### 4. Structured Output Enforcement
The AI is constrained to return **only valid JSON** with:
- A limited number of concerns
- A limited number of positives

This prevents verbose or speculative responses and ensures predictable parsing.

#### 5. Explicit Guardrails
The prompt includes explicit rules to prevent:
- Hallucinated missing protein when coverage is adequate
- Medical advice or diagnoses
- Fabrication of unprovided data

#### 6. Interpretation-Oriented Questions
Rather than asking for recommendations, the prompt focuses on:
- Alignment with medical history
- Contradictions with health logs
- High-level concerns

This aligns the AI’s role with interpretation and validation, not prescription.

Overall, the prompt is intentionally restrictive to ensure the AI functions as a **controlled reasoning layer** rather than a decision-maker.




### What I’d Improve With More Time

- Replace keyword-based heuristics with a structured food-to-nutrient mapping using a standardized nutrition database
- Add protein distribution analysis across meals (timing and spacing, not just presence)
- Introduce explainable scoring visuals to show how quality scores are derived
- Cache AI-assisted analysis results to reduce latency and repeated API calls 
- Add basic unit tests for data normalization and validation logic
- Support multiple client profiles dynamically instead of a single static input
- Introduce a lightweight ML-based nutrition estimation model that:
  - Takes the full meal plan text as input
  - Classifies food items into macronutrient categories (protein, carbohydrates, fats, ultra-processed/junk)
  - Produces approximate macro-level summaries (not precise grams)
  - Feeds these estimates into the existing validation and AI interpretation layers


### Running the Project Locally

1. Clone the repository
  ```bash
  git clone https://github.com/a-anuj/technical-assesment---Sia-Health.git
  cd technical-assesment--Sia-Health
  ```
2. Install dependencies:
  ```
    npm install
  ```
3. Add a `.env` file with:
  ```bash
    VITE_GROQ_API_KEY=your_api_key
  ```

4. Start the app:
  ```
   npm run dev
  ```