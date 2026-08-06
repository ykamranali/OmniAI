"""Base class every specialized Omni agent inherits from."""
from __future__ import annotations

from abc import ABC
from dataclasses import dataclass

from app.core.config import settings
from app.models.enums import AgentType
from app.services.llm_gateway import chat_completion


@dataclass
class AgentResult:
    output: str
    model: str


class BaseAgent(ABC):
    type: AgentType
    display_name: str
    description: str
    system_prompt: str

    def __init__(self, model: str | None = None) -> None:
        self.model = model or settings.DEFAULT_MODEL

    async def run(self, instruction: str, context: str = "") -> AgentResult:
        """Send the instruction to the LLM with this agent's system prompt."""
        messages = [{"role": "system", "content": self.system_prompt}]
        if context:
            messages.append({"role": "system", "content": f"Relevant context:\n{context}"})
        messages.append({"role": "user", "content": instruction})

        response = await chat_completion(self.model, messages)
        content = response["choices"][0]["message"]["content"]
        return AgentResult(output=content, model=self.model)
