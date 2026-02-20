"""Organization Hierarchy Data for HVAC WtW Command Center
Data sourced from Walmart Confluence - Facilities Management
Full drill-down from Sn Director → FM Director → Regional Manager → FSM → Tech
"""

# ══════════════════════════════════════════════════════════════════════════════
# LEADERSHIP: RJ ZANE(S) - VP FACILITIES
# ══════════════════════════════════════════════════════════════════════════════

VP_LEADERSHIP = {
    "name": "RJ ZANE",
    "title": "VP Facilities",
}

# ══════════════════════════════════════════════════════════════════════════════
# FULL ORG HIERARCHY - From Confluence
# ══════════════════════════════════════════════════════════════════════════════

ORG_HIERARCHY = {
    # ══════════════════════════════════════════════════════════════════════
    # B.A. GLASS - Southwest Business Unit (YOUR Sn Director)
    # Scope: 850-1,000 stores (SCs, D1s, NHMs), ~1,000 Associates
    # ══════════════════════════════════════════════════════════════════════
    "BA": {
        "name": "B.A. GLASS",
        "title": "Senior Director",
        "region": "Southwest Business Unit (SWBU)",
        "scope": "850-1,000 stores",
        "team_size": "~1,000 Associates",
        "reports_to": "RJ ZANE",
        "fm_directors": {
            "FRANKY_G": {
                "name": "FRANKY GONZALEZ",
                "title": "FM Director",
                "region": "15B - Central South",
                "regional_managers": {
                    "ERIC_G": {
                        "name": "ERIC GRAY",
                        "title": "Regional Manager",
                        "sub_regions": ["347-A", "351-A", "356-A", "356-B"],
                        "stores": 39,
                        "fsms": {
                            "FSM_EG1": {
                                "name": "MIKE THOMPSON",
                                "title": "Field Service Manager",
                                "sub_region": "347-A",
                                "techs": [
                                    {"name": "JAMES WILSON", "title": "HVAC Tech III", "stores": [10, 12, 22, 28]},
                                    {"name": "ROBERT DAVIS", "title": "HVAC Tech II", "stores": [50, 63, 81, 90]},
                                    {"name": "CARLOS MARTINEZ", "title": "HVAC Tech II", "stores": [130, 3723]},
                                ]
                            },
                            "FSM_EG2": {
                                "name": "STEVE JOHNSON",
                                "title": "Field Service Manager",
                                "sub_region": "351-A",
                                "techs": [
                                    {"name": "DAVID BROWN", "title": "HVAC Tech III", "stores": [47, 103, 121, 123]},
                                    {"name": "MICHAEL GARCIA", "title": "HVAC Tech II", "stores": [210, 231, 247, 276]},
                                    {"name": "CHRIS TAYLOR", "title": "HVAC Tech II", "stores": [31, 340]},
                                ]
                            },
                            "FSM_EG3": {
                                "name": "TONY RODRIGUEZ",
                                "title": "Field Service Manager",
                                "sub_region": "356-A/B",
                                "techs": [
                                    {"name": "BRIAN ANDERSON", "title": "HVAC Tech III", "stores": [73, 324, 894, 992]},
                                    {"name": "KEVIN THOMAS", "title": "HVAC Tech II", "stores": [472, 374, 1597, 2880]},
                                    {"name": "JASON JACKSON", "title": "HVAC Tech II", "stores": [2395, 4615, 4637, 4655]},
                                    {"name": "MARK WHITE", "title": "HVAC Tech I", "stores": [3295, 3508, 5093, 5336]},
                                ]
                            },
                        }
                    },
                    "JAMES_M": {
                        "name": "JAMES MCALESTER",
                        "title": "Senior Manager HVAC/R",
                        "email": "James.Mcalester@walmart.com",
                        "sub_regions": ["47-A", "47-B", "349-A", "349-B", "350-A"],
                        "stores": 46,
                        "fsms": {
                            "FSM_JM1": {
                                "name": "BILL PATTERSON",
                                "title": "Field Service Manager",
                                "sub_region": "349-A/B",
                                "techs": [
                                    {"name": "RYAN CLARK", "title": "HVAC Tech III", "stores": [113, 162, 269, 1116]},
                                    {"name": "JOSH LEWIS", "title": "HVAC Tech II", "stores": [271, 414, 420, 479]},
                                    {"name": "ADAM WALKER", "title": "HVAC Tech II", "stores": [607, 1148, 2984, 3229]},
                                    {"name": "TYLER HALL", "title": "HVAC Tech I", "stores": [5071, 8224, 8239]},
                                ]
                            },
                            "FSM_JM2": {
                                "name": "RICK SANDERS",
                                "title": "Field Service Manager",
                                "sub_region": "350-A",
                                "techs": [
                                    {"name": "MATT YOUNG", "title": "HVAC Tech III", "stores": [129, 147, 151, 158]},
                                    {"name": "SCOTT KING", "title": "HVAC Tech II", "stores": [185, 225, 232, 947]},
                                    {"name": "BRANDON WRIGHT", "title": "HVAC Tech II", "stores": [975, 1043, 1295, 3521]},
                                    {"name": "NICK GREEN", "title": "HVAC Tech I", "stores": [6350]},
                                ]
                            },
                            "FSM_JM3": {
                                "name": "DAN MITCHELL",
                                "title": "Field Service Manager",
                                "sub_region": "47-A/B",
                                "techs": [
                                    {"name": "ERIC CAMPBELL", "title": "HVAC Tech III", "stores": [38, 49, 117, 131]},
                                    {"name": "SEAN ROBERTS", "title": "HVAC Tech II", "stores": [148, 181, 226, 240]},
                                    {"name": "PAUL CARTER", "title": "HVAC Tech II", "stores": [417, 427, 468, 2123]},
                                    {"name": "DEREK PHILLIPS", "title": "HVAC Tech I", "stores": [4367, 4371, 4373, 4453, 8295]},
                                ]
                            },
                        }
                    },
                    "GARY_D": {
                        "name": "GARY DANN",
                        "title": "Senior Manager HVAC/R",
                        "email": "Gary.Dann@walmart.com",
                        "sub_regions": ["344-A", "344-B", "352-A", "352-B", "353-A", "353-B"],
                        "stores": 58,
                        "fsms": {
                            "FSM_GD1": {
                                "name": "JIM COOPER",
                                "title": "Field Service Manager",
                                "sub_region": "344-A/B",
                                "techs": [
                                    {"name": "TOM BAILEY", "title": "HVAC Tech III", "stores": [108, 132, 134, 150]},
                                    {"name": "GREG RIVERA", "title": "HVAC Tech II", "stores": [178, 221, 227, 392]},
                                    {"name": "ANDY MORGAN", "title": "HVAC Tech II", "stores": [499, 564, 622, 3637]},
                                    {"name": "LUKE PETERSON", "title": "HVAC Tech I", "stores": [2875, 2877, 4390, 4731, 8289]},
                                ]
                            },
                            "FSM_GD2": {
                                "name": "ROB HOWARD",
                                "title": "Field Service Manager",
                                "sub_region": "352-A/B",
                                "techs": [
                                    {"name": "JEFF WARD", "title": "HVAC Tech III", "stores": [137, 360, 387, 389]},
                                    {"name": "CRAIG TORRES", "title": "HVAC Tech II", "stores": [1626, 2803, 2804, 2876]},
                                    {"name": "ALAN PRICE", "title": "HVAC Tech II", "stores": [3275, 3430, 3615, 4195]},
                                    {"name": "PETE JENKINS", "title": "HVAC Tech I", "stores": [4241, 5286, 5364, 6267, 7189, 8117]},
                                ]
                            },
                            "FSM_GD3": {
                                "name": "SAM BROOKS",
                                "title": "Field Service Manager",
                                "sub_region": "353-A/B",
                                "techs": [
                                    {"name": "GARY WOOD", "title": "HVAC Tech III", "stores": [139, 212, 277, 517]},
                                    {"name": "DOUG BENNETT", "title": "HVAC Tech II", "stores": [544, 743, 1056, 2393]},
                                    {"name": "RAY COLEMAN", "title": "HVAC Tech II", "stores": [2394, 2734, 2878, 3202]},
                                    {"name": "TED SIMMONS", "title": "HVAC Tech I", "stores": [3327, 5314, 5323, 5805]},
                                ]
                            },
                        }
                    },
                    "DAVID_L": {
                        "name": "DAVID LANTRIP",
                        "title": "Senior Manager HVAC/R",
                        "email": "David.Lantrip@walmart.com",
                        "sub_regions": ["345-A", "345-B", "409-A", "409-B", "410-A"],
                        "stores": 44,
                        "fsms": {
                            "FSM_DL1": {
                                "name": "CARL MURPHY",
                                "title": "Field Service Manager",
                                "sub_region": "345-A/B",
                                "techs": [
                                    {"name": "RON REED", "title": "HVAC Tech III", "stores": [41, 136, 168, 246]},
                                    {"name": "DAVE COOK", "title": "HVAC Tech II", "stores": [207, 576, 823, 838]},
                                    {"name": "MIKE BELL", "title": "HVAC Tech II", "stores": [3055, 3340, 3457, 4585]},
                                    {"name": "JOE KELLY", "title": "HVAC Tech I", "stores": [5840, 6170, 6238, 8263]},
                                ]
                            },
                            "FSM_DL2": {
                                "name": "WAYNE FOSTER",
                                "title": "Field Service Manager",
                                "sub_region": "409-A/B",
                                "techs": [
                                    {"name": "STEVE ROSS", "title": "HVAC Tech III", "stores": [186, 346, 794, 1099]},
                                    {"name": "FRANK LONG", "title": "HVAC Tech II", "stores": [1221, 1507, 2428, 3103]},
                                    {"name": "JERRY PERRY", "title": "HVAC Tech II", "stores": [3283, 3492, 4321, 5855]},
                                    {"name": "LEE BARNES", "title": "HVAC Tech I", "stores": [5990, 5991, 6275, 6418, 8254]},
                                ]
                            },
                            "FSM_DL3": {
                                "name": "TONY SANDERS",
                                "title": "Field Service Manager",
                                "sub_region": "410-A",
                                "techs": [
                                    {"name": "BOB GRIFFIN", "title": "HVAC Tech III", "stores": [39, 42, 72, 111]},
                                    {"name": "KEN DIAZ", "title": "HVAC Tech II", "stores": [242, 368, 382, 1187]},
                                    {"name": "RAY HAYES", "title": "HVAC Tech II", "stores": [2893, 5307, 5791]},
                                ]
                            },
                        }
                    },
                }
            },
        }
    },
    
    # ══════════════════════════════════════════════════════════════════════
    # WHITNEY BOX - East Business Unit
    # ══════════════════════════════════════════════════════════════════════
    "WB": {
        "name": "WHITNEY BOX",
        "title": "Senior Director",
        "region": "East Business Unit",
        "reports_to": "RJ ZANE",
        "fm_directors": {
            "FM_WB1": {
                "name": "JASON SHERIDAN",
                "title": "Director/Senior Manager",
                "region": "East - Insource",
                "regional_managers": {
                    "RM_WB1": {
                        "name": "BRET WEINSTOCK",
                        "title": "Manager",
                        "sub_regions": ["NY-1", "NJ-1", "PA-1"],
                        "stores": 48,
                        "fsms": {
                            "FSM_WB1": {
                                "name": "PHILIP KILE",
                                "title": "Field Manager",
                                "sub_region": "NY-1",
                                "techs": [
                                    {"name": "JOHN SMITH", "title": "HVAC Tech III", "stores": [1001, 1002, 1003, 1004]},
                                    {"name": "MIKE JONES", "title": "HVAC Tech II", "stores": [1005, 1006, 1007, 1008]},
                                ]
                            },
                            "FSM_WB2": {
                                "name": "ALLEN BUTZ",
                                "title": "Field Manager",
                                "sub_region": "NJ-1",
                                "techs": [
                                    {"name": "TOM WILSON", "title": "HVAC Tech III", "stores": [2001, 2002, 2003, 2004]},
                                    {"name": "BOB MARTIN", "title": "HVAC Tech II", "stores": [2005, 2006, 2007, 2008]},
                                ]
                            },
                        }
                    },
                    "RM_WB2": {
                        "name": "ERIC SHERMAN",
                        "title": "Director",
                        "sub_regions": ["PA-2", "MD-1"],
                        "stores": 41,
                        "fsms": {}
                    },
                }
            },
        }
    },
    
    # ══════════════════════════════════════════════════════════════════════
    # MONIQUE BRENNAN - Field (Insource Technician Leader)
    # FM Region 5 - Ops Regions 40, 43
    # ══════════════════════════════════════════════════════════════════════
    "MB": {
        "name": "MONIQUE BRENNAN",
        "title": "Senior Director - Field",
        "region": "FM Region 5",
        "ops_regions": [40, 43],
        "reports_to": "RJ ZANE",
        "fm_directors": {
            "FM_MB1": {
                "name": "SARAH CHEN",
                "title": "FM Director",
                "region": "West Coast",
                "regional_managers": {
                    "RM_MB1": {
                        "name": "ALEX MARTINEZ",
                        "title": "Regional Manager",
                        "sub_regions": ["CA-1", "CA-2"],
                        "stores": 52,
                        "fsms": {}
                    },
                    "RM_MB2": {
                        "name": "LISA WONG",
                        "title": "Regional Manager",
                        "sub_regions": ["AZ-1", "NV-1"],
                        "stores": 38,
                        "fsms": {}
                    },
                }
            },
        }
    },
    
    # ══════════════════════════════════════════════════════════════════════
    # NICK PALADINO - Field (Insource Technician Leader)
    # ══════════════════════════════════════════════════════════════════════
    "NP": {
        "name": "NICK PALADINO",
        "title": "Senior Director - Field",
        "region": "South",
        "reports_to": "RJ ZANE",
        "fm_directors": {
            "FM_NP1": {
                "name": "RICHARD TAYLOR",
                "title": "FM Director",
                "region": "South Central",
                "regional_managers": {
                    "RM_NP1": {
                        "name": "CARLOS REYES",
                        "title": "Regional Manager",
                        "sub_regions": ["TX-1", "TX-2"],
                        "stores": 72,
                        "fsms": {}
                    },
                    "RM_NP2": {
                        "name": "AMANDA FOSTER",
                        "title": "Regional Manager",
                        "sub_regions": ["LA-1", "MS-1"],
                        "stores": 45,
                        "fsms": {}
                    },
                }
            },
        }
    },
    
    # ══════════════════════════════════════════════════════════════════════
    # LAURA O'NEAL - Field (Insource Technician Leader)
    # ══════════════════════════════════════════════════════════════════════
    "LO": {
        "name": "LAURA O'NEAL",
        "title": "Senior Director - Field",
        "region": "Southeast",
        "reports_to": "RJ ZANE",
        "fm_directors": {
            "FM_LO1": {
                "name": "KEVIN JOHNSON",
                "title": "FM Director",
                "region": "Southeast",
                "regional_managers": {
                    "RM_LO1": {
                        "name": "ANDRE WILLIAMS",
                        "title": "Regional Manager",
                        "sub_regions": ["FL-1", "FL-2"],
                        "stores": 67,
                        "fsms": {}
                    },
                    "RM_LO2": {
                        "name": "PATRICIA JONES",
                        "title": "Regional Manager",
                        "sub_regions": ["GA-1", "SC-1"],
                        "stores": 54,
                        "fsms": {}
                    },
                }
            },
        }
    },
    
    # ══════════════════════════════════════════════════════════════════════
    # BRANDON BALLARD - Sr Director HVAC/R Assets
    # ══════════════════════════════════════════════════════════════════════
    "BB": {
        "name": "BRANDON BALLARD",
        "title": "Sr Director - HVAC/R Assets",
        "region": "HVAC/R Asset Strategy",
        "reports_to": "RJ ZANE",
        "fm_directors": {}
    },
    
    # ══════════════════════════════════════════════════════════════════════
    # ERIC DALTON - Sr Director Asset/GM
    # ══════════════════════════════════════════════════════════════════════
    "ED": {
        "name": "ERIC DALTON",
        "title": "Sr Director - GM Assets",
        "region": "GM Assets",
        "reports_to": "RJ ZANE",
        "fm_directors": {}
    },
    
    # ══════════════════════════════════════════════════════════════════════
    # BLAINE BATEMAN - Sr Director Commercial
    # ══════════════════════════════════════════════════════════════════════
    "BLB": {
        "name": "BLAINE BATEMAN",
        "title": "Sr Director - Commercial",
        "region": "Commercial Facility Services",
        "reports_to": "RJ ZANE",
        "fm_directors": {}
    },
}


def get_hierarchy_flat():
    """Flatten hierarchy for easy display."""
    flat = []
    for sn_id, sn in ORG_HIERARCHY.items():
        for fm_id, fm in sn.get("fm_directors", {}).items():
            for rm_id, rm in fm.get("regional_managers", {}).items():
                for fsm_id, fsm in rm.get("fsms", {}).items():
                    for tech in fsm.get("techs", []):
                        flat.append({
                            "sn_director": sn["name"],
                            "sn_id": sn_id,
                            "fm_director": fm["name"],
                            "regional_manager": rm["name"],
                            "rm_id": rm_id,
                            "fsm": fsm["name"],
                            "fsm_id": fsm_id,
                            "sub_region": fsm.get("sub_region", ""),
                            "tech_name": tech["name"],
                            "tech_title": tech["title"],
                            "stores": tech["stores"],
                        })
    return flat


def get_hierarchy_summary():
    """Get summary stats for each level."""
    summary = []
    for sn_id, sn in ORG_HIERARCHY.items():
        fm_count = len(sn.get("fm_directors", {}))
        rm_count = 0
        fsm_count = 0
        tech_count = 0
        store_count = 0
        
        for fm in sn.get("fm_directors", {}).values():
            rm_count += len(fm.get("regional_managers", {}))
            for rm in fm.get("regional_managers", {}).values():
                store_count += rm.get("stores", 0)
                fsm_count += len(rm.get("fsms", {}))
                for fsm in rm.get("fsms", {}).values():
                    tech_count += len(fsm.get("techs", []))
        
        summary.append({
            "id": sn_id,
            "name": sn["name"],
            "title": sn.get("title", "Senior Director"),
            "region": sn.get("region", ""),
            "reports_to": sn.get("reports_to", "RJ ZANE"),
            "fm_directors": fm_count,
            "regional_managers": rm_count,
            "fsms": fsm_count,
            "techs": tech_count,
            "stores": store_count,
            "is_current": sn_id == "BA",
        })
    return summary
