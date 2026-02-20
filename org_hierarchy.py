"""Organization Hierarchy Data for HVAC WtW Command Center
REAL DATA from dblish report - Region 15B Focus
Full drill-down from Sn Director → FM Director → Regional Manager → FS Manager
"""

# ══════════════════════════════════════════════════════════════════════════════
# REAL ORG DATA FROM DBLISH REPORT
# Source: gecgithub01.walmart.com/dblish/-hvac-wtw-report
# ══════════════════════════════════════════════════════════════════════════════

# Senior Director -> FM Directors mapping (REAL DATA)
SR_TO_FM = {
    "B.A. Glass": [
        "Emile Peterson",
        "Franky Gonzalez",
        "George Joseph",
        "Jeff Bishop",
        "Scott Raye",
        "Tyler Matejovsky",
    ],
    "Monique Brennan": [
        "Anthony Steele",
        "James Melton",
        "Jeffrey Haddock Jr",
        "John Hopton",
        "Justin Ayers",
        "Matt Shepard",
        "Mike Rials",
    ],
    "Whitney Box": [
        "Chris Walker",
        "Chris Welborn",
        "Eric Lovelace",
        "John Sessoms",
        "Laura Trevino",
        "Matthew DeMarco",
    ],
    "Laura Moore": [
        "Brian Conover",
        "Donnie Chester",
        "Jack Grahek",
        "Josh Thaxton",
        "Sonya Webster",
    ],
    "Nick Paladino": [
        "Elizabeth Wilson",
        "Jared Eslick Coats",
        "Rod Stephens",
        "Steve Andrews",
        "Tim Weaver",
    ],
}

# FM Director -> Regional Managers mapping (REAL DATA)
FM_TO_REG = {
    # B.A. Glass's team
    "Franky Gonzalez": ["Dane Clayton", "David Guess", "Eric Gray", "Jason McAlester"],
    "George Joseph": ["Daniel Gray", "Garry Montgomery", "Jeremiah Barrett", "Lon Whitley"],
    "Emile Peterson": ["Brandon Snowdy", "Elmer Lea", "Israel Carmona", "Oussama Kassem"],
    "Jeff Bishop": ["Alberto Cortez", "Carl Hammond", "Gabriel Carmona", "Kenneth Quigley"],
    "Scott Raye": ["Danny Wood", "Gary Williams", "Heath Wills", "John Thompson", "Scott Molesworth"],
    "Tyler Matejovsky": ["Christopher Fuentes", "Gabe Macias", "Israel Pino", "Ralph Vasquez"],
    
    # Monique Brennan's team
    "James Melton": ["Christopher Polk", "James Welty", "Sidney Farrar", "Stephan Leonard"],
    "Justin Ayers": ["Cameron Harris", "Jason Parmer", "Jonathan Weeden", "Steven Phipps"],
    "Mike Rials": ["Charles Eubank", "Hiram Tucker", "Kenneth Jackson"],
    "Anthony Steele": ["Braxton Swanner", "Christopher Weaver", "Jason Robinson", "Troy Darnell"],
    "Jeffrey Haddock Jr": ["James Haley", "Jared Livingston", "Manuel Duprey", "Michael Bushway", "Tyler Edwards"],
    "John Hopton": ["Andy Willis", "Clayton Cavitt", "Gil A Soler Garcia", "John Kelly", "Mike Price"],
    "Matt Shepard": ["Dan Collins", "Jerald Minchew", "Thomas Youmans", "William Seymour"],
    
    # Whitney Box's team
    "Chris Walker": ["Carin Rouleau", "Ismael Honore", "James Talmadge Jr", "Robert Daley"],
    "Chris Welborn": ["Alissa Welch", "Guy Knight", "Jeff Jackson", "Julie Penrow-Canfield", "Richard Grubbs"],
    "Eric Lovelace": ["Gerald Pruitt", "Jermaine Edwards", "Rafael Leon", "Roger Dube"],
    "John Sessoms": ["Adam Descoteaux", "Adam Wolever", "Carl Gogol", "Gail Holznagel", "Keisha Tharpe", "Kevin Gentry"],
    "Laura Trevino": ["Jermaine Edwards", "Jimmy Pope", "Jose Dourado", "Joshua Anderson", "Kevin Hubbard", "Rafael Leon"],
    "Matthew DeMarco": ["Francisco Ullola", "George Boskie", "James Williams", "Steve Rickabaugh"],
    
    # Laura Moore's team
    "Brian Conover": ["Bill Bee", "Chadwick Nowak", "DJ Czizek", "Joseph Stockwell", "Justin Miller", "Steven Watkins"],
    "Donnie Chester": ["Brandon Williams", "Derrick Sharp", "Richard Varela", "Robert Peck", "Scott Cameron", "Scottie Starr", "Terry White"],
    "Jack Grahek": ["Justin Burner", "Ken Christensen", "TJ Evans", "Thomas Miller", "Tony Frankovic"],
    "Josh Thaxton": ["Bryan Archer", "Chad Pennington", "Jeff Mikesell", "Mark Boatwright", "Scottie Starr"],
    "Sonya Webster": ["Bradley Stotts", "Christian Campbell", "Rob Beahl", "Vincent Copcutt"],
    
    # Nick Paladino's team
    "Elizabeth Wilson": ["Dave Morrin", "Lindsey Lombard", "Robert Santoyo"],
    "Jared Eslick Coats": ["Dennis Blagdon", "Hien Nguyen", "Kevlin Bruns", "Melissa Ross", "Micah Mclaughlin", "Samuel Lara", "Todd Jensen"],
    "Rod Stephens": ["Carl Camacho", "Joshua Dunne", "Terrell Campbell"],
    "Steve Andrews": ["Kevin Booher", "Rodney Hullinger", "Shawn Bancroft", "Tony Weaver"],
    "Tim Weaver": ["Ignacio Vega", "Joel St John", "Nathan Daniel", "Randy Dunne", "Sam Gaeta", "Sean Garrett"],
}

# Regional Manager -> FS Managers mapping (REAL DATA - Franky's team detailed)
REG_TO_FS = {
    # Franky Gonzalez's Regional Managers
    "Jason McAlester": ["Charles Rogers", "Jonathan Stanfield", "Louis Allen", "Rich Colter", "Skip Cargile"],
    "Dane Clayton": ["David Mccormick", "Edwin Babcock", "Matt Parker", "Michael Sadler", "Tom Hensley"],
    "David Guess": ["Kevin Harwell", "Kevin Middleton", "Nick Hedrick", "Patrick Belk", "Stephen Watters", "Tim Good Voice"],
    "Eric Gray": ["Bryan Tims", "Kendall McAlester", "Kyle Kessler", "Mitchell Kelley"],
    
    # George Joseph's Regional Managers
    "Daniel Gray": ["Adrienne Williams", "Genaro Sanchez", "Grant Berndt", "Shawn Cagle", "William Winslow"],
    "Garry Montgomery": ["David Blackledge", "James Crain", "Matthew Nagorka", "Roland Steele"],
    "Jeremiah Barrett": ["Casey Rocquin", "Kevin Collins", "Shawn Perret", "Stephen Dean"],
    "Lon Whitley": ["Anthony Monteleone", "Cody Richardson", "Cuy Rich", "Ryan Dumas"],
    
    # Emile Peterson's Regional Managers
    "Brandon Snowdy": ["Arthur Williams III", "Christian Collins", "Matthew Shaw", "Randy DeJohn Jr"],
    "Elmer Lea": ["Armando Reyes", "Cesar Hinojosa Gomez", "Felix Gonzales", "Robert Smith"],
    "Israel Carmona": ["Cyrille Beuto", "Ricky Ramirez", "Scotty Morgan"],
    "Oussama Kassem": ["Brandon Villa", "Peter Bertoncini", "Shay Hoskins"],
    
    # More Regional Managers...
    "Cameron Harris": ["Jim Wingard", "Nicholas Nunnelley", "Roy Carter", "Tommie Richards"],
    "Hiram Tucker": ["Jason Morgan", "Marcus McCall Sr.", "Marty Dipolito", "Phillip Davis", "Preston Bowles"],
    "Clayton Cavitt": ["Avery Lomon", "Jack Abbott", "Joe Cramer", "Trey Wyrick"],
    "John Kelly": ["Earnest Sheppard", "James Jenkins", "Justin Good", "Zach Anschultz"],
}

# ══════════════════════════════════════════════════════════════════════════════
# BUILD NESTED HIERARCHY STRUCTURE
# ══════════════════════════════════════════════════════════════════════════════

def build_org_hierarchy():
    """Build nested hierarchy from flat mappings."""
    hierarchy = {}
    
    for sr_name, fm_list in SR_TO_FM.items():
        sr_id = sr_name.replace(" ", "_").replace(".", "").upper()[:3]
        
        fm_directors = {}
        for fm_name in fm_list:
            fm_id = fm_name.replace(" ", "_").upper()[:8]
            
            reg_managers = {}
            for reg_name in FM_TO_REG.get(fm_name, []):
                reg_id = reg_name.replace(" ", "_").upper()[:8]
                
                fs_managers = {}
                for fs_name in REG_TO_FS.get(reg_name, []):
                    fs_id = fs_name.replace(" ", "_").upper()[:8]
                    fs_managers[fs_id] = {
                        "name": fs_name,
                        "title": "FS Manager",
                        "techs": []  # Would need BQ data to populate
                    }
                
                reg_managers[reg_id] = {
                    "name": reg_name,
                    "title": "Regional Manager",
                    "stores": 0,  # Would need BQ data
                    "fsms": fs_managers,
                }
            
            fm_directors[fm_id] = {
                "name": fm_name,
                "title": "FM Director",
                "regional_managers": reg_managers,
            }
        
        hierarchy[sr_id] = {
            "name": sr_name,
            "title": "Senior Director",
            "region": "Field",
            "fm_directors": fm_directors,
        }
    
    return hierarchy


# Build the hierarchy on module load
ORG_HIERARCHY = build_org_hierarchy()


def get_hierarchy_summary():
    """Get summary stats for each level."""
    summary = []
    for sn_id, sn in ORG_HIERARCHY.items():
        fm_count = len(sn.get("fm_directors", {}))
        rm_count = 0
        fsm_count = 0
        
        for fm in sn.get("fm_directors", {}).values():
            rm_count += len(fm.get("regional_managers", {}))
            for rm in fm.get("regional_managers", {}).values():
                fsm_count += len(rm.get("fsms", {}))
        
        summary.append({
            "id": sn_id,
            "name": sn["name"],
            "title": sn.get("title", "Senior Director"),
            "region": sn.get("region", "Field"),
            "fm_directors": fm_count,
            "regional_managers": rm_count,
            "fsms": fsm_count,
            "techs": 0,
            "stores": 0,
            "is_current": "B.A." in sn["name"] or "Glass" in sn["name"],
        })
    return summary


def get_hierarchy_flat():
    """Flatten hierarchy for easy display."""
    flat = []
    for sn_id, sn in ORG_HIERARCHY.items():
        for fm_id, fm in sn.get("fm_directors", {}).items():
            for rm_id, rm in fm.get("regional_managers", {}).items():
                for fsm_id, fsm in rm.get("fsms", {}).items():
                    flat.append({
                        "sn_director": sn["name"],
                        "sn_id": sn_id,
                        "fm_director": fm["name"],
                        "regional_manager": rm["name"],
                        "rm_id": rm_id,
                        "fsm": fsm["name"],
                        "fsm_id": fsm_id,
                    })
    return flat
