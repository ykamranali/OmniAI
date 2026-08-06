"""
Omni 3D Studio routes.

`/three/generate` asks the 3D Agent to produce a declarative scene graph
(objects, materials, lights, camera, animation) as JSON. The frontend's
React Three Fiber canvas renders that graph directly — see
frontend/src/components/three-studio/SceneRenderer.tsx.
"""
from __future__ import annotations

import json

from fastapi import APIRouter, Depends

from app.agents.three_d_agent import ThreeDAgent
from app.api.deps import get_current_user
from app.core.logging import logger
from app.models.user import User
from app.schemas.model import ThreeSceneRequest, ThreeSceneResponse

router = APIRouter(prefix="/three", tags=["three"])

_FALLBACK_SCENE = {
    "background": "#050505",
    "camera": {"position": [0, 2, 8], "fov": 50},
    "lights": [
        {"type": "ambient", "intensity": 0.4},
        {"type": "point", "position": [5, 5, 5], "intensity": 1.2, "color": "#4d7cff"},
    ],
    "objects": [
        {
            "id": "hero-sphere",
            "type": "sphere",
            "position": [0, 0, 0],
            "args": [1.5, 64, 64],
            "material": {"color": "#7c3aed", "metalness": 0.6, "roughness": 0.2},
            "animation": {"type": "rotate", "axis": "y", "speed": 0.3},
        },
        {
            "id": "particles",
            "type": "particles",
            "count": 400,
            "spread": 12,
            "color": "#22d3ee",
        },
    ],
}


@router.post("/generate", response_model=ThreeSceneResponse)
async def generate_scene(payload: ThreeSceneRequest, user: User = Depends(get_current_user)) -> ThreeSceneResponse:
    agent = ThreeDAgent()
    result = await agent.run(
        f"Design a Three.js scene graph for: {payload.prompt}. "
        "Respond ONLY with JSON matching this shape: "
        '{"background": str, "camera": {"position": [x,y,z], "fov": num}, '
        '"lights": [{"type": "ambient"|"point"|"directional", ...}], '
        '"objects": [{"id": str, "type": "box"|"sphere"|"torus"|"plane"|"particles", '
        '"position": [x,y,z], "args": [...], "material": {"color": str, "metalness": num, "roughness": num}, '
        '"animation": {"type": "rotate"|"float"|"none", "axis": "x"|"y"|"z", "speed": num}}]}'
    )

    try:
        scene = json.loads(result.output)
    except json.JSONDecodeError:
        logger.warning("3D Agent did not return valid JSON; serving fallback scene.")
        scene = _FALLBACK_SCENE

    return ThreeSceneResponse(scene=scene)
