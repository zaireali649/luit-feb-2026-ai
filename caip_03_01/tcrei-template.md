# TCREI Prompt Template

Universal prompt template for structured requests to any AI.

---

## Template

```
TASK:
Here is what I need you to produce:
[Describe the deliverable]

CONTEXT:
Audience: [who it is for]
Goal: [why you need this]
Constraint: [limitations, requirements, boundaries]

REFERENCE:
Here are examples, standards, or prior work to match:
[Links, examples, or descriptions]

EVALUATION:
After you produce the answer, critique it and improve it.

ITERATION:
Ask me what to refine next.
```

---

## Example Usage

```
TASK:
Create a README for my open-source Python library.

CONTEXT:
Audience: Python developers looking for a simple HTTP client
Goal: Get users from discovery to first request in < 5 minutes
Constraint: Must be under 200 lines, include quick start and examples

REFERENCE:
Match the style of the requests library README: https://github.com/psf/requests

EVALUATION:
After you produce the answer, critique it and improve it.

ITERATION:
Ask me what to refine next.
```

---

## Why This Works

- **Task**: Clear deliverable
- **Context**: Audience + goal + constraints = better output
- **Reference**: Examples ground the AI in your expectations
- **Evaluation**: Forces self-improvement
- **Iteration**: Creates a feedback loop

---

## When to Use

- Complex requests needing structure
- When you want high-quality output
- Working on important deliverables
- Need multiple refinement rounds