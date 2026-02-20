User: Act as a devops engineer. 

TASK:
Here is what I need you to produce:
Generate code to stream responses from a model in AWS Bedrock.

CONTEXT:
Audience: Junior Devops Engineers
Goal: Teach them about boto3 and bedrock
Constraint: Do not use models that require provisioned thruoughput.

REFERENCE:
Here are examples, standards, or prior work to match:
bedrock_client = boto3.client('bedrock-runtime)

EVALUATION:
After you produce the answer, critique it and improve it.

ITERATION:
Ask me what to refine next.
Model: 
# Streaming Responses from AWS Bedrock using Boto3

## Overview

AWS Bedrock is a fully managed service that provides access to foundation models (FMs) from various AI companies. In this tutorial, we'll learn how to **stream responses** from a Bedrock model using Python's `boto3` library. Streaming is important because it returns tokens as they're generated, rather than waiting for the entire response — resulting in a much better user experience.

---

## Prerequisites

```bash
# Install required packages
pip install boto3
```

**AWS Setup:**
- An AWS account with Bedrock access enabled
- IAM credentials configured (`aws configure`) with permissions for `bedrock-runtime:InvokeModelWithResponseStream`
- Model access enabled in the Bedrock console (go to **Bedrock → Model access → Enable** for the models you want)

---

## Architecture

```
┌──────────┐      ┌───────────────────┐      ┌─────────────────┐
│  Python   │─────▶│  Bedrock Runtime  │─────▶│  Foundation     │
│  Client   │◀─────│  API (Streaming)  │◀─────│  Model (On-     │
│  (boto3)  │chunks│                   │tokens│  Demand)        │
└──────────┘      └───────────────────┘      └─────────────────┘
```

---

## The Code

### 1. Basic Streaming Example (Amazon Nova Lite)

We use **on-demand models** only (no provisioned throughput required).

```python
"""
bedrock_stream.py
Stream responses from AWS Bedrock using boto3.
Uses on-demand models only (no provisioned throughput needed).
"""

import boto3
import json


def get_bedrock_client(region_name: str = "us-east-1"):
    """
    Create and return a Bedrock Runtime client.
    
    The 'bedrock-runtime' service is used for inference (invoking models).
    The 'bedrock' service (without -runtime) is for management operations.
    """
    bedrock_client = boto3.client(
        service_name='bedrock-runtime',
        region_name=region_name
    )
    return bedrock_client


def stream_nova_lite(prompt: str, region_name: str = "us-east-1"):
    """
    Stream a response from Amazon Nova Lite (on-demand, no provisioned throughput).
    
    Model ID: amazon.nova-lite-v1:0
    This is a lightweight, cost-effective model from Amazon.
    """
    bedrock_client = get_bedrock_client(region_name)

    # --- Build the request body ---
    # Amazon Nova models use the "messages" API format
    request_body = json.dumps({
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "inferenceConfig": {
            "maxTokens": 1024,
            "temperature": 0.7,
            "topP": 0.9
        }
    })

    # --- Invoke the model with streaming ---
    response = bedrock_client.invoke_model_with_response_stream(
        modelId="amazon.nova-lite-v1:0",
        contentType="application/json",
        accept="application/json",
        body=request_body
    )

    # --- Process the stream ---
    print(f"\n{'='*60}")
    print(f"Prompt: {prompt}")
    print(f"{'='*60}")
    print("Response: ", end="", flush=True)

    full_response = ""

    # The response contains an 'body' that is an EventStream
    for event in response['body']:
        # Each event is a chunk of the response
        chunk = json.loads(event['chunk']['bytes'])

        # Amazon Nova streams content in 'contentBlockDelta' events
        if 'contentBlockDelta' in chunk:
            delta = chunk['contentBlockDelta']['delta']
            if 'text' in delta:
                text = delta['text']
                print(text, end="", flush=True)  # Print token as it arrives
                full_response += text

    print(f"\n{'='*60}\n")
    return full_response


def stream_claude_haiku(prompt: str, region_name: str = "us-east-1"):
    """
    Stream a response from Anthropic Claude 3 Haiku (on-demand).
    
    Model ID: anthropic.claude-3-haiku-20240307-v1:0
    Haiku is the fastest and most affordable Claude model — no provisioned throughput needed.
    """
    bedrock_client = get_bedrock_client(region_name)

    # --- Build the request body ---
    # Claude models use the Anthropic Messages API format
    request_body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "temperature": 0.7,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    })

    # --- Invoke with streaming ---
    response = bedrock_client.invoke_model_with_response_stream(
        modelId="anthropic.claude-3-haiku-20240307-v1:0",
        contentType="application/json",
        accept="application/json",
        body=request_body
    )

    # --- Process the stream ---
    print(f"\n{'='*60}")
    print(f"Prompt: {prompt}")
    print(f"Model: Claude 3 Haiku")
    print(f"{'='*60}")
    print("Response: ", end="", flush=True)

    full_response = ""
    input_tokens = 0
    output_tokens = 0

    for event in response['body']:
        chunk = json.loads(event['chunk']['bytes'])

        # Claude streams with different event types
        match chunk.get('type'):
            case 'content_block_delta':
                if chunk['delta']['type'] == 'text_delta':
                    text = chunk['delta']['text']
                    print(text, end="", flush=True)
                    full_response += text
            case 'message_delta':
                # Final event — contains stop reason and usage stats
                output_tokens = chunk.get('usage', {}).get('output_tokens', 0)
            case 'message_start':
                # First event — contains input token count
                input_tokens = chunk.get('message', {}).get('usage', {}).get('input_tokens', 0)

    print(f"\n--- Tokens: input={input_tokens}, output={output_tokens} ---")
    print(f"{'='*60}\n")
    return full_response


def stream_meta_llama(prompt: str, region_name: str = "us-east-1"):
    """
    Stream a response from Meta Llama 3.1 8B Instruct (on-demand).
    
    Model ID: meta.llama3-1-8b-instruct-v1:0
    Lightweight Llama model available on-demand.
    """
    bedrock_client = get_bedrock_client(region_name)

    request_body = json.dumps({
        "prompt": prompt,
        "max_gen_len": 1024,
        "temperature": 0.7,
        "top_p": 0.9
    })

    response = bedrock_client.invoke_model_with_response_stream(
        modelId="meta.llama3-1-8b-instruct-v1:0",
        contentType="application/json",
        accept="application/json",
        body=request_body
    )

    print(f"\n{'='*60}")
    print(f"Prompt: {prompt}")
    print(f"Model: Meta Llama 3.1 8B Instruct")
    print(f"{'='*60}")
    print("Response: ", end="", flush=True)

    full_response = ""

    for event in response['body']:
        chunk = json.loads(event['chunk']['bytes'])
        if 'generation' in chunk:
            text = chunk['generation']
            print(text, end="", flush=True)
            full_response += text

    print(f"\n{'='*60}\n")
    return full_response


# ─────────────────────────────────────────────
# Robust version with error handling
# ─────────────────────────────────────────────

def stream_with_error_handling(
    prompt: str,
    model_id: str = "amazon.nova-lite-v1:0",
    region_name: str = "us-east-1",
    max_tokens: int = 1024,
    temperature: float = 0.7
):
    """
    Production-ready streaming function with proper error handling.
    """
    try:
        bedrock_client = get_bedrock_client(region_name)
    except Exception as e:
        print(f"[ERROR] Failed to create Bedrock client: {e}")
        print("  → Check your AWS credentials: run 'aws configure'")
        print("  → Ensure your IAM role has 'bedrock-runtime:InvokeModelWithResponseStream' permission")
        raise

    # Build request body based on model provider
    if model_id.startswith("anthropic."):
        request_body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}]
        })
    elif model_id.startswith("amazon.nova"):
        request_body = json.dumps({
            "messages": [
                {"role": "user", "content": [{"text": prompt}]}
            ],
            "inferenceConfig": {
                "maxTokens": max_tokens,
                "temperature": temperature
            }
        })
    elif model_id.startswith("meta."):
        request_body = json.dumps({
            "prompt": prompt,
            "max_gen_len": max_tokens,
            "temperature": temperature
        })
    else:
        raise ValueError(f"Unsupported model: {model_id}. Add its request format to this function.")

    try:
        response = bedrock_client.invoke_model_with_response_stream(
            modelId=model_id,
            contentType="application/json",
            accept="application/json",
            body=request_body
        )
    except bedrock_client.exceptions.AccessDeniedException:
        print(f"[ERROR] Access denied for model '{model_id}'.")
        print("  → Go to AWS Console → Bedrock → Model access → Enable the model")
        raise
    except bedrock_client.exceptions.ValidationException as e:
        print(f"[ERROR] Validation error: {e}")
        print("  → Check your model ID and request body format")
        raise
    except bedrock_client.exceptions.ThrottlingException:
        print(f"[ERROR] Throttled! You're hitting rate limits.")
        print("  → Implement exponential backoff or request a quota increase")
        raise
    except Exception as e:
        print(f"[ERROR] Unexpected error invoking model: {e}")
        raise

    # Stream the response
    full_response = ""
    try:
        for event in response['body']:
            chunk = json.loads(event['chunk']['bytes'])

            text = ""
            # Extract text based on model provider response format
            if model_id.startswith("anthropic."):
                if chunk.get('type') == 'content_block_delta':
                    text = chunk['delta'].get('text', '')
            elif model_id.startswith("amazon.nova"):
                if 'contentBlockDelta' in chunk:
                    text = chunk['contentBlockDelta']['delta'].get('text', '')
            elif model_id.startswith("meta."):
                text = chunk.get('generation', '')

            if text:
                print(text, end="", flush=True)
                full_response += text

    except Exception as e:
        print(f"\n[ERROR] Stream interrupted: {e}")
        raise

    print()  # Newline after streaming
    return full_response


# ─────────────────────────────────────────────
# Main — Run the examples
# ─────────────────────────────────────────────

if __name__ == "__main__":
    test_prompt = "Explain what a Docker container is in 3 sentences."

    # Pick one to test (uncomment):
    
    # Option 1: Amazon Nova Lite (cheapest, fastest to get started)
    stream_nova_lite(test_prompt)

    # Option 2: Claude 3 Haiku
    # stream_claude_haiku(test_prompt)

    # Option 3: Meta Llama
    # stream_meta_llama(test_prompt)

    # Option 4: Production-ready with error handling
    # stream_with_error_handling(test_prompt, model_id="amazon.nova-lite-v1:0")
```

---

### 2. Required IAM Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BedrockInvokeStream",
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-lite-v1:0",
                "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
                "arn:aws:bedrock:us-east-1::foundation-model/meta.llama3-1-8b-instruct-v1:0"
            ]
        }
    ]
}
```

---

## Key Concepts for Junior Engineers

| Concept | Explanation |
|---|---|
| `bedrock-runtime` vs `bedrock` | `bedrock-runtime` is for **inference** (calling models). `bedrock` is for **management** (listing models, etc.) |
| `invoke_model` vs `invoke_model_with_response_stream` | `invoke_model` waits for the full response. `invoke_model_with_response_stream` returns tokens as they're generated. |
| On-Demand vs Provisioned Throughput | **On-demand** = pay per token, no commitment. **Provisioned** = reserved capacity, requires commitment. We use on-demand only here. |
| `flush=True` | Forces Python to print each token immediately instead of buffering output. |
| EventStream | The streaming response body is an **EventStream** — an iterable that yields chunks as the model generates them. |

---

## Self-Critique & Improvements Made

### Critique of Initial Draft:
1. **❌ Missing error handling** — The basic examples don't handle common failures like access denied or throttling.  
   **✅ Fixed:** Added `stream_with_error_handling()` with specific exception handling and actionable error messages.

2. **❌ Only one model** — Junior engineers should see that different models have different request/response formats.  
   **✅ Fixed:** Added examples for 3 providers (Amazon Nova, Anthropic Claude, Meta Llama) to illustrate format differences.

3. **❌ No IAM guidance** — Without the right permissions, nothing works.  
   **✅ Fixed:** Added a least-privilege IAM policy scoped to specific model ARNs.

4. **❌ No explanation of streaming event structure** — Each provider returns stream events differently.  
   **✅ Fixed:** Code comments explain the event structure per model (`contentBlockDelta`, `content_block_delta`, `generation`).

5. **❌ Could use the Converse API** — Bedrock's `converse_stream` API provides a **unified interface** across models, avoiding the need to handle different formats. This is worth noting but I kept the lower-level approach for educational purposes since the goal is to teach `boto3` and Bedrock fundamentals.

---

## What would you like me to refine next?

Some options:
- **A)** Add a `converse_stream` example (unified API, simpler code)
- **B)** Add retry logic with exponential backoff for production use
- **C)** Add a Terraform/CloudFormation template for the IAM role
- **D)** Add async streaming with `aioboto3`
- **E)** Add a system prompt / multi-turn conversation example
- **F)** Something else?