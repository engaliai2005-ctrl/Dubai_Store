import json
import struct
import math
import os
from PIL import Image

def build_dubai_store_glb(output_path, logo_path):
    print("Starting Dubai Store 3D GLB generator...")

    # Load and process logo image for texture embedding
    with open(logo_path, "rb") as f:
        logo_bytes = f.read()

    bin_data = bytearray()
    buffer_views = []
    accessors = []
    materials = []
    meshes = []
    nodes = []

    def add_buffer_data(data_bytes, target=None):
        offset = len(bin_data)
        bin_data.extend(data_bytes)
        # Pad to 4-byte alignment
        pad = (4 - (len(bin_data) % 4)) % 4
        if pad:
            bin_data.extend(b'\x00' * pad)
        
        bv_idx = len(buffer_views)
        bv = {
            "buffer": 0,
            "byteOffset": offset,
            "byteLength": len(data_bytes)
        }
        if target:
            bv["target"] = target
        buffer_views.append(bv)
        return bv_idx

    # Materials definition
    # 0: Turquoise Fascia & Columns
    materials.append({
        "name": "Mat_Turquoise_Brand",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.0, 0.74, 0.80, 1.0], # #00BDCC
            "metallicFactor": 0.15,
            "roughnessFactor": 0.25
        }
    })
    # 1: Clean White Ceiling & Walls
    materials.append({
        "name": "Mat_Clean_White",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.96, 0.97, 0.98, 1.0],
            "metallicFactor": 0.05,
            "roughnessFactor": 0.3
        }
    })
    # 2: High Gloss White (Island counter & planters)
    materials.append({
        "name": "Mat_Gloss_White",
        "pbrMetallicRoughness": {
            "baseColorFactor": [1.0, 1.0, 1.0, 1.0],
            "metallicFactor": 0.1,
            "roughnessFactor": 0.08
        }
    })
    # 3: Polished Marble Floor
    materials.append({
        "name": "Mat_Marble_Floor",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.92, 0.94, 0.95, 1.0],
            "metallicFactor": 0.1,
            "roughnessFactor": 0.12
        }
    })
    # 4: Brushed Stainless Steel
    materials.append({
        "name": "Mat_Stainless_Steel",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.85, 0.87, 0.89, 1.0],
            "metallicFactor": 0.9,
            "roughnessFactor": 0.2
        }
    })
    # 5: Polished Chrome (handles, trims)
    materials.append({
        "name": "Mat_Chrome",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.95, 0.95, 0.97, 1.0],
            "metallicFactor": 0.98,
            "roughnessFactor": 0.05
        }
    })
    # 6: Ultra Clear Glass (for sliding doors & facade)
    materials.append({
        "name": "Mat_Glass_Clear",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.9, 0.97, 1.0, 0.28],
            "metallicFactor": 0.05,
            "roughnessFactor": 0.05
        },
        "alphaMode": "BLEND",
        "doubleSided": True
    })
    # 7: Glowing Cyan Neon (LED strips & signs)
    materials.append({
        "name": "Mat_Cyan_Neon",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.0, 0.9, 1.0, 1.0],
            "metallicFactor": 0.0,
            "roughnessFactor": 0.1
        },
        "emissiveFactor": [0.0, 0.95, 1.0]
    })
    # 8: Glowing White LED (ceiling lights & Apple logo)
    materials.append({
        "name": "Mat_White_Light",
        "pbrMetallicRoughness": {
            "baseColorFactor": [1.0, 1.0, 1.0, 1.0],
            "metallicFactor": 0.0,
            "roughnessFactor": 0.05
        },
        "emissiveFactor": [1.0, 1.0, 1.0]
    })
    # 9: Palm Plant Green
    materials.append({
        "name": "Mat_Palm_Leaves",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.12, 0.52, 0.18, 1.0],
            "metallicFactor": 0.0,
            "roughnessFactor": 0.6
        },
        "doubleSided": True
    })
    # 10: Phone Body (Titanium / Dark Glass)
    materials.append({
        "name": "Mat_Phone_Body",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.15, 0.18, 0.22, 1.0],
            "metallicFactor": 0.85,
            "roughnessFactor": 0.2
        }
    })
    # 11: Phone Display (OLED Glowing Screen)
    materials.append({
        "name": "Mat_Phone_Screen",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.1, 0.65, 0.9, 1.0],
            "metallicFactor": 0.1,
            "roughnessFactor": 0.1
        },
        "emissiveFactor": [0.05, 0.45, 0.7]
    })
    # 12: Official Dubai Store Logo on Header Sign
    # Embed logo image
    logo_bv_idx = add_buffer_data(logo_bytes)
    images = [{
        "bufferView": logo_bv_idx,
        "mimeType": "image/jpeg"
    }]
    samplers = [{
        "magFilter": 9729, # LINEAR
        "minFilter": 9987, # LINEAR_MIPMAP_LINEAR
        "wrapS": 33071,    # CLAMP_TO_EDGE
        "wrapT": 33071
    }]
    textures = [{
        "sampler": 0,
        "source": 0
    }]
    materials.append({
        "name": "Mat_Dubai_Store_Logo",
        "pbrMetallicRoughness": {
            "baseColorTexture": { "index": 0 },
            "metallicFactor": 0.1,
            "roughnessFactor": 0.2
        },
        "emissiveFactor": [0.4, 0.75, 0.8]
    })

    # Geometry creation helpers
    def create_box_mesh(name, min_x, min_y, min_z, max_x, max_y, max_z, mat_idx):
        positions = []
        normals = []
        uvs = []
        indices = []

        # 6 faces of the cube
        faces = [
            # Front (+Z)
            (
                [(min_x, min_y, max_z), (max_x, min_y, max_z), (max_x, max_y, max_z), (min_x, max_y, max_z)],
                (0, 0, 1),
                [(0, 0), (1, 0), (1, 1), (0, 1)]
            ),
            # Back (-Z)
            (
                [(max_x, min_y, min_z), (min_x, min_y, min_z), (min_x, max_y, min_z), (max_x, max_y, min_z)],
                (0, 0, -1),
                [(0, 0), (1, 0), (1, 1), (0, 1)]
            ),
            # Top (+Y)
            (
                [(min_x, max_y, max_z), (max_x, max_y, max_z), (max_x, max_y, min_z), (min_x, max_y, min_z)],
                (0, 1, 0),
                [(0, 0), (1, 0), (1, 1), (0, 1)]
            ),
            # Bottom (-Y)
            (
                [(min_x, min_y, min_z), (max_x, min_y, min_z), (max_x, min_y, max_z), (min_x, min_y, max_z)],
                (0, -1, 0),
                [(0, 0), (1, 0), (1, 1), (0, 1)]
            ),
            # Right (+X)
            (
                [(max_x, min_y, max_z), (max_x, min_y, min_z), (max_x, max_y, min_z), (max_x, max_y, max_z)],
                (1, 0, 0),
                [(0, 0), (1, 0), (1, 1), (0, 1)]
            ),
            # Left (-X)
            (
                [(min_x, min_y, min_z), (min_x, min_y, max_z), (min_x, max_y, max_z), (min_x, max_y, min_z)],
                (-1, 0, 0),
                [(0, 0), (1, 0), (1, 1), (0, 1)]
            )
        ]

        for pts, norm, uvs_f in faces:
            base_idx = len(positions)
            for i in range(4):
                positions.append(pts[i])
                normals.append(norm)
                uvs.append(uvs_f[i])
            indices.extend([base_idx, base_idx + 1, base_idx + 2, base_idx, base_idx + 2, base_idx + 3])

        return build_primitive(name, positions, normals, uvs, indices, mat_idx)

    def create_quad_mesh(name, p1, p2, p3, p4, normal, uv1, uv2, uv3, uv4, mat_idx):
        positions = [p1, p2, p3, p4]
        normals = [normal, normal, normal, normal]
        uvs = [uv1, uv2, uv3, uv4]
        indices = [0, 1, 2, 0, 2, 3]
        return build_primitive(name, positions, normals, uvs, indices, mat_idx)

    def create_cylinder_mesh(name, cx, cz, base_y, top_y, r, segments, mat_idx):
        positions = []
        normals = []
        uvs = []
        indices = []

        # Sides
        for i in range(segments):
            theta1 = 2.0 * math.pi * i / segments
            theta2 = 2.0 * math.pi * (i + 1) / segments
            cos1, sin1 = math.cos(theta1), math.sin(theta1)
            cos2, sin2 = math.cos(theta2), math.sin(theta2)

            base_idx = len(positions)
            # 4 vertices for side quad
            positions.append((cx + r * cos1, base_y, cz + r * sin1))
            positions.append((cx + r * cos2, base_y, cz + r * sin2))
            positions.append((cx + r * cos2, top_y, cz + r * sin2))
            positions.append((cx + r * cos1, top_y, cz + r * sin1))

            normals.append((cos1, 0, sin1))
            normals.append((cos2, 0, sin2))
            normals.append((cos2, 0, sin2))
            normals.append((cos1, 0, sin1))

            uvs.append((i / segments, 0))
            uvs.append(((i + 1) / segments, 0))
            uvs.append(((i + 1) / segments, 1))
            uvs.append((i / segments, 1))

            indices.extend([base_idx, base_idx + 1, base_idx + 2, base_idx, base_idx + 2, base_idx + 3])

        return build_primitive(name, positions, normals, uvs, indices, mat_idx)

    def build_primitive(mesh_name, positions, normals, uvs, indices, mat_idx):
        pos_bytes = bytearray()
        norm_bytes = bytearray()
        uv_bytes = bytearray()
        idx_bytes = bytearray()

        min_pos = [float('inf')] * 3
        max_pos = [float('-inf')] * 3

        for p in positions:
            pos_bytes.extend(struct.pack('<3f', p[0], p[1], p[2]))
            for k in range(3):
                if p[k] < min_pos[k]: min_pos[k] = p[k]
                if p[k] > max_pos[k]: max_pos[k] = p[k]

        for n in normals:
            norm_bytes.extend(struct.pack('<3f', n[0], n[1], n[2]))

        for u in uvs:
            uv_bytes.extend(struct.pack('<2f', u[0], u[1]))

        for idx in indices:
            idx_bytes.extend(struct.pack('<I', idx))

        pos_bv = add_buffer_data(pos_bytes, target=34962)
        norm_bv = add_buffer_data(norm_bytes, target=34962)
        uv_bv = add_buffer_data(uv_bytes, target=34962)
        idx_bv = add_buffer_data(idx_bytes, target=34963)

        pos_acc = len(accessors)
        accessors.append({
            "bufferView": pos_bv,
            "byteOffset": 0,
            "componentType": 5126, # FLOAT
            "count": len(positions),
            "type": "VEC3",
            "min": min_pos,
            "max": max_pos
        })

        norm_acc = len(accessors)
        accessors.append({
            "bufferView": norm_bv,
            "byteOffset": 0,
            "componentType": 5126,
            "count": len(normals),
            "type": "VEC3"
        })

        uv_acc = len(accessors)
        accessors.append({
            "bufferView": uv_bv,
            "byteOffset": 0,
            "componentType": 5126,
            "count": len(uvs),
            "type": "VEC2"
        })

        idx_acc = len(accessors)
        accessors.append({
            "bufferView": idx_bv,
            "byteOffset": 0,
            "componentType": 5125, # UNSIGNED_INT
            "count": len(indices),
            "type": "SCALAR"
        })

        mesh_idx = len(meshes)
        meshes.append({
            "name": mesh_name,
            "primitives": [{
                "attributes": {
                    "POSITION": pos_acc,
                    "NORMAL": norm_acc,
                    "TEXCOORD_0": uv_acc
                },
                "indices": idx_acc,
                "material": mat_idx
            }]
        })
        return mesh_idx

    # Assemble All Geometry
    root_children = []

    # 1. Main Turquoise Fascia (Top Header)
    m_fascia = create_box_mesh("Fascia_Top", -3.6, 2.05, -0.3, 3.6, 3.45, 0.05, 0)
    n_fascia = len(nodes)
    nodes.append({"name": "Fascia_Top", "mesh": m_fascia})
    root_children.append(n_fascia)

    # 1.1 Official Dubai Store Logo Sign on the Fascia
    # Centered in the middle of the fascia plate
    m_logo = create_quad_mesh(
        "Fascia_Logo_Sign",
        (-2.2, 2.2, 0.06),
        (2.2, 2.2, 0.06),
        (2.2, 3.3, 0.06),
        (-2.2, 3.3, 0.06),
        (0, 0, 1),
        (0, 1), (1, 1), (1, 0), (0, 0),
        12 # Mat_Dubai_Store_Logo
    )
    n_logo = len(nodes)
    nodes.append({"name": "Fascia_Logo_Sign", "mesh": m_logo})
    root_children.append(n_logo)

    # 1.2 Five Downlight Spotlights on Canopy Underside
    spot_x = [-2.8, -1.4, 0.0, 1.4, 2.8]
    for i, sx in enumerate(spot_x):
        m_spot = create_cylinder_mesh(f"Spotlight_{i+1}", sx, -0.1, 2.02, 2.05, 0.08, 12, 8)
        n_spot = len(nodes)
        nodes.append({"name": f"Spotlight_{i+1}", "mesh": m_spot})
        root_children.append(n_spot)

    # 2. Left & Right Architectural Turquoise Columns
    # Left Pillar
    m_p_left = create_box_mesh("Pillar_Left", -3.6, -0.05, -0.4, -2.85, 2.05, 0.05, 0)
    n_p_left = len(nodes)
    nodes.append({"name": "Pillar_Left", "mesh": m_p_left})
    root_children.append(n_p_left)

    # Left Pillar Vertical LED Neon Strip
    m_p_led_l = create_box_mesh("Pillar_Left_LED", -3.05, 0.1, 0.055, -2.95, 1.95, 0.06, 7)
    n_p_led_l = len(nodes)
    nodes.append({"name": "Pillar_Left_LED", "mesh": m_p_led_l})
    root_children.append(n_p_led_l)

    # Right Pillar
    m_p_right = create_box_mesh("Pillar_Right", 2.85, -0.05, -0.4, 3.6, 2.05, 0.05, 0)
    n_p_right = len(nodes)
    nodes.append({"name": "Pillar_Right", "mesh": m_p_right})
    root_children.append(n_p_right)

    # Right Pillar Vertical LED Neon Strip
    m_p_led_r = create_box_mesh("Pillar_Right_LED", 2.95, 0.1, 0.055, 3.05, 1.95, 0.06, 7)
    n_p_led_r = len(nodes)
    nodes.append({"name": "Pillar_Right_LED", "mesh": m_p_led_r})
    root_children.append(n_p_led_r)

    # 3. Outer Static Glass Panels
    # Left Outer Glass
    m_glass_l = create_box_mesh("Facade_Glass_Left", -2.85, 0.0, -0.05, -1.25, 2.05, -0.03, 6)
    n_glass_l = len(nodes)
    nodes.append({"name": "Facade_Glass_Left", "mesh": m_glass_l})
    root_children.append(n_glass_l)

    # Right Outer Glass
    m_glass_r = create_box_mesh("Facade_Glass_Right", 1.25, 0.0, -0.05, 2.85, 2.05, -0.03, 6)
    n_glass_r = len(nodes)
    nodes.append({"name": "Facade_Glass_Right", "mesh": m_glass_r})
    root_children.append(n_glass_r)

    # 4. Entrance Stainless Steel Frame & Tracks
    # Header Frame (Lintel)
    m_lintel = create_box_mesh("Entrance_Header_Frame", -1.3, 1.98, -0.08, 1.3, 2.05, 0.02, 4)
    n_lintel = len(nodes)
    nodes.append({"name": "Entrance_Header_Frame", "mesh": m_lintel})
    root_children.append(n_lintel)

    # Entrance "Entrance" Sign Plate
    m_ent_sign = create_box_mesh("Entrance_Sign_Plate", -0.45, 1.92, -0.01, 0.45, 1.97, 0.01, 4)
    n_ent_sign = len(nodes)
    nodes.append({"name": "Entrance_Sign_Plate", "mesh": m_ent_sign})
    root_children.append(n_ent_sign)

    # Left Door Jamb
    m_jamb_l = create_box_mesh("Door_Jamb_Left", -1.3, 0.0, -0.08, -1.25, 2.05, 0.02, 4)
    n_jamb_l = len(nodes)
    nodes.append({"name": "Door_Jamb_Left", "mesh": m_jamb_l})
    root_children.append(n_jamb_l)

    # Right Door Jamb
    m_jamb_r = create_box_mesh("Door_Jamb_Right", 1.25, 0.0, -0.08, 1.3, 2.05, 0.02, 4)
    n_jamb_r = len(nodes)
    nodes.append({"name": "Door_Jamb_Right", "mesh": m_jamb_r})
    root_children.append(n_jamb_r)

    # Bottom Floor Sliding Guide Track
    m_track_b = create_box_mesh("Door_Bottom_Track", -1.25, 0.0, -0.04, 1.25, 0.03, 0.02, 4)
    n_track_b = len(nodes)
    nodes.append({"name": "Door_Bottom_Track", "mesh": m_track_b})
    root_children.append(n_track_b)

    # 5. SEPARATE SLIDING GLASS DOORS (CRITICAL REQUIREMENT)
    # Left Door: Door_Left_Sliding
    # As a dedicated parent node with its glass pane and handle
    left_door_children = []
    
    # Left Door Glass Pane
    m_d_glass_l = create_box_mesh("Door_Left_Glass", -1.22, 0.03, -0.02, 0.01, 1.95, 0.0, 6)
    n_d_glass_l = len(nodes)
    nodes.append({"name": "Door_Left_Glass", "mesh": m_d_glass_l})
    left_door_children.append(n_d_glass_l)

    # Left Door Metal Frame Edges
    m_d_frame_l = create_box_mesh("Door_Left_Frame", -1.23, 0.03, -0.025, 0.02, 1.96, 0.005, 4)
    n_d_frame_l = len(nodes)
    nodes.append({"name": "Door_Left_Frame", "mesh": m_d_frame_l})
    left_door_children.append(n_d_frame_l)

    # Left Door Chrome Tubular Vertical Handle
    m_d_handle_l = create_cylinder_mesh("Door_Left_Handle", -0.06, 0.015, 0.6, 1.35, 0.016, 12, 5)
    n_d_handle_l = len(nodes)
    nodes.append({"name": "Door_Left_Handle", "mesh": m_d_handle_l})
    left_door_children.append(n_d_handle_l)

    n_door_left = len(nodes)
    nodes.append({
        "name": "Door_Left_Sliding",
        "children": left_door_children,
        "translation": [0, 0, 0]
    })
    root_children.append(n_door_left)

    # Right Door: Door_Right_Sliding
    right_door_children = []

    # Right Door Glass Pane
    m_d_glass_r = create_box_mesh("Door_Right_Glass", -0.01, 0.03, -0.02, 1.22, 1.95, 0.0, 6)
    n_d_glass_r = len(nodes)
    nodes.append({"name": "Door_Right_Glass", "mesh": m_d_glass_r})
    right_door_children.append(n_d_glass_r)

    # Right Door Metal Frame Edges
    m_d_frame_r = create_box_mesh("Door_Right_Frame", -0.02, 0.03, -0.025, 1.23, 1.96, 0.005, 4)
    n_d_frame_r = len(nodes)
    nodes.append({"name": "Door_Right_Frame", "mesh": m_d_frame_r})
    right_door_children.append(n_d_frame_r)

    # Right Door Chrome Tubular Vertical Handle
    m_d_handle_r = create_cylinder_mesh("Door_Right_Handle", 0.06, 0.015, 0.6, 1.35, 0.016, 12, 5)
    n_d_handle_r = len(nodes)
    nodes.append({"name": "Door_Right_Handle", "mesh": m_d_handle_r})
    right_door_children.append(n_d_handle_r)

    n_door_right = len(nodes)
    nodes.append({
        "name": "Door_Right_Sliding",
        "children": right_door_children,
        "translation": [0, 0, 0]
    })
    root_children.append(n_door_right)

    # 6. STORE INTERIOR (Extends 8 meters deep)
    # 6.1 Polished Marble Floor
    m_floor = create_box_mesh("Interior_Marble_Floor", -3.2, -0.05, -8.0, 3.2, 0.0, 0.5, 3)
    n_floor = len(nodes)
    nodes.append({"name": "Interior_Marble_Floor", "mesh": m_floor})
    root_children.append(n_floor)

    # 6.2 Interior Clean White Ceiling
    m_ceil = create_box_mesh("Interior_Ceiling", -3.2, 3.0, -8.0, 3.2, 3.15, 0.0, 1)
    n_ceil = len(nodes)
    nodes.append({"name": "Interior_Ceiling", "mesh": m_ceil})
    root_children.append(n_ceil)

    # 6.3 Linear Recessed Ceiling LED Strip Lights (5 strips extending back)
    led_x = [-2.0, -1.0, 0.0, 1.0, 2.0]
    for i, lx in enumerate(led_x):
        m_led_strip = create_box_mesh(f"Ceiling_LED_Strip_{i+1}", lx - 0.04, 2.99, -7.5, lx + 0.04, 3.01, -0.5, 8)
        n_led_strip = len(nodes)
        nodes.append({"name": f"Ceiling_LED_Strip_{i+1}", "mesh": m_led_strip})
        root_children.append(n_led_strip)

    # 6.4 Left Interior Wall (Apple branding & shelves)
    m_wall_l = create_box_mesh("Interior_Wall_Left", -3.2, 0.0, -8.0, -3.05, 3.0, 0.0, 0)
    n_wall_l = len(nodes)
    nodes.append({"name": "Interior_Wall_Left", "mesh": m_wall_l})
    root_children.append(n_wall_l)

    # Apple Glowing Logo Plate on Left Wall
    m_apple = create_box_mesh("Apple_Logo_Glow", -3.04, 2.1, -2.8, -3.03, 2.5, -2.4, 8)
    n_apple = len(nodes)
    nodes.append({"name": "Apple_Logo_Glow", "mesh": m_apple})
    root_children.append(n_apple)

    # "Welcome to our store" Sign Plate
    m_welcome = create_box_mesh("Welcome_Store_Sign", -3.04, 1.2, -1.8, -3.03, 1.8, -1.1, 1)
    n_welcome = len(nodes)
    nodes.append({"name": "Welcome_Store_Sign", "mesh": m_welcome})
    root_children.append(n_welcome)

    # Left Wall Shelving Bays (4 Bays, 4 Shelves each = 16 shelves with phones!)
    bay_z_l = [-2.0, -3.5, -5.0, -6.5]
    shelf_y = [0.45, 0.85, 1.25, 1.65]
    for b_idx, bz in enumerate(bay_z_l):
        # Recessed lit bay backing
        m_bay = create_box_mesh(f"Left_Bay_Backing_{b_idx+1}", -3.04, 0.35, bz - 0.55, -3.03, 1.9, bz + 0.55, 7)
        n_bay = len(nodes)
        nodes.append({"name": f"Left_Bay_Backing_{b_idx+1}", "mesh": m_bay})
        root_children.append(n_bay)

        for s_idx, sy in enumerate(shelf_y):
            # Glass display shelf
            m_shelf = create_box_mesh(f"Left_Shelf_{b_idx+1}_{s_idx+1}", -3.04, sy, bz - 0.5, -2.75, sy + 0.02, bz + 0.5, 6)
            n_shelf = len(nodes)
            nodes.append({"name": f"Left_Shelf_{b_idx+1}_{s_idx+1}", "mesh": m_shelf})
            root_children.append(n_shelf)

            # 3 Phones on each shelf!
            for p_i, p_off in enumerate([-0.3, 0.0, 0.3]):
                m_ph_body = create_box_mesh(f"L_Phone_{b_idx}_{s_idx}_{p_i}", -2.88, sy + 0.02, bz + p_off - 0.04, -2.82, sy + 0.16, bz + p_off + 0.04, 10)
                m_ph_scrn = create_box_mesh(f"L_Phone_Scr_{b_idx}_{s_idx}_{p_i}", -2.819, sy + 0.03, bz + p_off - 0.035, -2.818, sy + 0.15, bz + p_off + 0.035, 11)
                n_pb = len(nodes)
                nodes.append({"name": f"L_Phone_{b_idx}_{s_idx}_{p_i}", "mesh": m_ph_body})
                root_children.append(n_pb)
                n_ps = len(nodes)
                nodes.append({"name": f"L_Phone_Scr_{b_idx}_{s_idx}_{p_i}", "mesh": m_ph_scrn})
                root_children.append(n_ps)

    # 6.5 Right Interior Wall (Samsung branding & shelves)
    m_wall_r = create_box_mesh("Interior_Wall_Right", 3.05, 0.0, -8.0, 3.2, 3.0, 0.0, 0)
    n_wall_r = len(nodes)
    nodes.append({"name": "Interior_Wall_Right", "mesh": m_wall_r})
    root_children.append(n_wall_r)

    # Samsung Glowing Logo Plate on Right Wall
    m_samsung = create_box_mesh("Samsung_Logo_Glow", 3.03, 2.1, -2.9, 3.04, 2.5, -2.1, 8)
    n_samsung = len(nodes)
    nodes.append({"name": "Samsung_Logo_Glow", "mesh": m_samsung})
    root_children.append(n_samsung)

    # Right Wall Shelving Bays (4 Bays, 4 Shelves each = 16 shelves with phones!)
    for b_idx, bz in enumerate(bay_z_l):
        # Recessed lit bay backing
        m_bay = create_box_mesh(f"Right_Bay_Backing_{b_idx+1}", 3.03, 0.35, bz - 0.55, 3.04, 1.9, bz + 0.55, 7)
        n_bay = len(nodes)
        nodes.append({"name": f"Right_Bay_Backing_{b_idx+1}", "mesh": m_bay})
        root_children.append(n_bay)

        for s_idx, sy in enumerate(shelf_y):
            # Glass display shelf
            m_shelf = create_box_mesh(f"Right_Shelf_{b_idx+1}_{s_idx+1}", 2.75, sy, bz - 0.5, 3.04, sy + 0.02, bz + 0.5, 6)
            n_shelf = len(nodes)
            nodes.append({"name": f"Right_Shelf_{b_idx+1}_{s_idx+1}", "mesh": m_shelf})
            root_children.append(n_shelf)

            # 3 Phones on each shelf!
            for p_i, p_off in enumerate([-0.3, 0.0, 0.3]):
                m_ph_body = create_box_mesh(f"R_Phone_{b_idx}_{s_idx}_{p_i}", 2.82, sy + 0.02, bz + p_off - 0.04, 2.88, sy + 0.16, bz + p_off + 0.04, 10)
                m_ph_scrn = create_box_mesh(f"R_Phone_Scr_{b_idx}_{s_idx}_{p_i}", 2.818, sy + 0.03, bz + p_off - 0.035, 2.819, sy + 0.15, bz + p_off + 0.035, 11)
                n_pb = len(nodes)
                nodes.append({"name": f"R_Phone_{b_idx}_{s_idx}_{p_i}", "mesh": m_ph_body})
                root_children.append(n_pb)
                n_ps = len(nodes)
                nodes.append({"name": f"R_Phone_Scr_{b_idx}_{s_idx}_{p_i}", "mesh": m_ph_scrn})
                root_children.append(n_ps)

    # 6.6 Rear Feature Wall (Accent wall with Dubai Store Logo)
    m_wall_back = create_box_mesh("Interior_Wall_Back", -3.2, 0.0, -8.0, 3.2, 3.0, -7.85, 0)
    n_wall_back = len(nodes)
    nodes.append({"name": "Interior_Wall_Back", "mesh": m_wall_back})
    root_children.append(n_wall_back)

    # Rear Wall Dubai Store Glowing Logo Plate
    m_back_logo = create_box_mesh("Rear_Dubai_Store_Logo", -1.1, 1.8, -7.84, 1.1, 2.3, -7.83, 8)
    n_back_logo = len(nodes)
    nodes.append({"name": "Rear_Dubai_Store_Logo", "mesh": m_back_logo})
    root_children.append(n_back_logo)

    # Rear Counter Table
    m_back_counter = create_box_mesh("Rear_Counter_Desk", -1.8, 0.0, -7.8, 1.8, 0.9, -7.0, 2)
    n_back_counter = len(nodes)
    nodes.append({"name": "Rear_Counter_Desk", "mesh": m_back_counter})
    root_children.append(n_back_counter)

    # 6.7 Central Modern Island Showcase Counter (Exactly as in photo!)
    # White glossy podium counter
    m_ctr = create_box_mesh("Center_Showcase_Counter", -0.75, 0.0, -3.8, 0.75, 0.92, -3.0, 2)
    n_ctr = len(nodes)
    nodes.append({"name": "Center_Showcase_Counter", "mesh": m_ctr})
    root_children.append(n_ctr)

    # Island Counter LED Bottom Skirting Glow
    m_ctr_glow = create_box_mesh("Counter_Bottom_Glow", -0.72, 0.0, -3.78, 0.72, 0.06, -3.02, 7)
    n_ctr_glow = len(nodes)
    nodes.append({"name": "Counter_Bottom_Glow", "mesh": m_ctr_glow})
    root_children.append(n_ctr_glow)

    # Interactive Display Phones on the Island Counter
    for i, c_x in enumerate([-0.4, 0.0, 0.4]):
        m_c_phone = create_box_mesh(f"Counter_Phone_{i+1}", c_x - 0.06, 0.92, -3.45, c_x + 0.06, 1.05, -3.35, 10)
        m_c_scr = create_box_mesh(f"Counter_Phone_Scr_{i+1}", c_x - 0.05, 0.93, -3.348, c_x + 0.05, 1.04, -3.345, 11)
        n_cp = len(nodes)
        nodes.append({"name": f"Counter_Phone_{i+1}", "mesh": m_c_phone})
        root_children.append(n_cp)
        n_cs = len(nodes)
        nodes.append({"name": f"Counter_Phone_Scr_{i+1}", "mesh": m_c_scr})
        root_children.append(n_cs)

    # 7. Decorative White Fluted Planters & Lush Palm Plants (Flanking entrance!)
    # Left Planter Urn
    m_urn_l = create_cylinder_mesh("Planter_Urn_Left", -1.95, -0.2, 0.0, 0.85, 0.28, 16, 2)
    n_urn_l = len(nodes)
    nodes.append({"name": "Planter_Urn_Left", "mesh": m_urn_l})
    root_children.append(n_urn_l)

    # Left Palm Leaves (3 cascading quads branching upward)
    leaf_angles = [0.0, 1.2, 2.4, 3.6, 4.8]
    for i, la in enumerate(leaf_angles):
        dx = math.cos(la) * 0.45
        dz = math.sin(la) * 0.45
        m_leaf = create_quad_mesh(
            f"Palm_Leaf_L_{i+1}",
            (-1.95, 0.85, -0.2),
            (-1.95 + dx * 0.4, 1.2, -0.2 + dz * 0.4),
            (-1.95 + dx, 1.5, -0.2 + dz),
            (-1.95 + dx * 0.6, 1.1, -0.2 + dz * 0.6),
            (0, 1, 0),
            (0, 0), (1, 0), (1, 1), (0, 1),
            9
        )
        n_leaf = len(nodes)
        nodes.append({"name": f"Palm_Leaf_L_{i+1}", "mesh": m_leaf})
        root_children.append(n_leaf)

    # Right Planter Urn
    m_urn_r = create_cylinder_mesh("Planter_Urn_Right", 1.95, -0.2, 0.0, 0.85, 0.28, 16, 2)
    n_urn_r = len(nodes)
    nodes.append({"name": "Planter_Urn_Right", "mesh": m_urn_r})
    root_children.append(n_urn_r)

    # Right Palm Leaves
    for i, la in enumerate(leaf_angles):
        dx = math.cos(la) * 0.45
        dz = math.sin(la) * 0.45
        m_leaf = create_quad_mesh(
            f"Palm_Leaf_R_{i+1}",
            (1.95, 0.85, -0.2),
            (1.95 + dx * 0.4, 1.2, -0.2 + dz * 0.4),
            (1.95 + dx, 1.5, -0.2 + dz),
            (1.95 + dx * 0.6, 1.1, -0.2 + dz * 0.6),
            (0, 1, 0),
            (0, 0), (1, 0), (1, 1), (0, 1),
            9
        )
        n_leaf = len(nodes)
        nodes.append({"name": f"Palm_Leaf_R_{i+1}", "mesh": m_leaf})
        root_children.append(n_leaf)

    # Root Node
    root_node_idx = len(nodes)
    nodes.append({
        "name": "DubaiStore_Scene_Root",
        "children": root_children
    })

    # Assemble GLTF Structure
    gltf_dict = {
        "asset": {
            "version": "2.0",
            "generator": "Dubai Store Photorealistic 3D Engine"
        },
        "scenes": [
            {
                "name": "DubaiStore_MainScene",
                "nodes": [root_node_idx]
            }
        ],
        "scene": 0,
        "nodes": nodes,
        "meshes": meshes,
        "materials": materials,
        "textures": textures,
        "images": images,
        "samplers": samplers,
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [
            {
                "byteLength": len(bin_data)
            }
        ]
    }

    # Encode JSON chunk
    json_bytes = json.dumps(gltf_dict, separators=(',', ':')).encode('utf-8')
    # Pad JSON to 4-byte alignment with spaces (0x20)
    json_pad = (4 - (len(json_bytes) % 4)) % 4
    if json_pad:
        json_bytes += b' ' * json_pad

    # Binary buffer padding
    bin_pad = (4 - (len(bin_data) % 4)) % 4
    if bin_pad:
        bin_data.extend(b'\x00' * bin_pad)

    total_glb_len = 12 + 8 + len(json_bytes) + 8 + len(bin_data)

    # Pack GLB
    # Header: magic (glTF), version (2), total length
    glb_header = struct.pack('<4sII', b'glTF', 2, total_glb_len)
    # Chunk 0: JSON chunk
    chunk0_header = struct.pack('<II', len(json_bytes), 0x4E4F534A) # 'JSON'
    # Chunk 1: BIN chunk
    chunk1_header = struct.pack('<II', len(bin_data), 0x004E4942) # 'BIN\0'

    with open(output_path, 'wb') as out_f:
        out_f.write(glb_header)
        out_f.write(chunk0_header)
        out_f.write(json_bytes)
        out_f.write(chunk1_header)
        out_f.write(bin_data)

    print(f"Successfully generated photorealistic GLB: {output_path} ({total_glb_len} bytes)")
    print(f"Total Nodes: {len(nodes)}, Total Meshes: {len(meshes)}, Materials: {len(materials)}")

if __name__ == "__main__":
    out = "C:/Users/alizb/.gemini/antigravity/scratch/dubai-store/public/Dubai_Store_3D_Official.glb"
    logo = "C:/Users/alizb/.gemini/antigravity/scratch/dubai-store/public/logo.jpg"
    build_dubai_store_glb(out, logo)
