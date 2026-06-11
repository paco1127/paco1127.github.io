import os
import requests

# 1. Grab environment variables from the GitHub Action runner
# The USERNAME is provided by GitHub automatically; the PAT is your secret key
USERNAME = os.getenv("GITHUB_REPOSITORY_OWNER")
TOKEN = os.getenv("GH_PAT")

if not TOKEN:
    raise ValueError("Error: GH_PAT environment variable is missing!")

print(f"Starting repository scanning for user: {USERNAME}")

# 2. Query the authenticated user endpoint to fetch BOTH public and private repos
# Using /user/repos instead of /users/{username}/repos is required to see private items
url = "https://api.github.com/user/repos"
headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

# We request up to 100 repositories per page and filter for items owned by you
params = {
    "per_page": 100,
    "type": "owner",
    "sort": "updated"
}

try:
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    repos = response.json()
except requests.exceptions.RequestException as e:
    print(f"Failed to fetch repositories from GitHub API: {e}")
    exit(1)

# 3. Filter repositories that have GitHub Pages turned on
# We also make sure to exclude the root index repository itself
pages_repos = []
for repo in repos:
    is_root_repo = repo["name"].lower() == f"{USERNAME}.github.io".lower()
    if repo.get("has_pages") and not is_root_repo:
        pages_repos.append({
            "name": repo["name"],
            "url": f"https://{USERNAME}.github.io/{repo['name']}/",
            "description": repo.get("description") or "<i>No description provided.</i>",
            "private": repo.get("private", False)
        })

print(f"Found {len(pages_repos)} hosted GitHub Pages repositories.")

# 4. Generate the pure HTML structure dynamically
html_items = ""
for page in pages_repos:
    # Add a visual badge if the source repository is private (hidden)
    badge = " <span style='background:#cf222e;color:#fff;padding:2px 6px;font-size:0.75em;border-radius:3px;vertical-align:middle;margin-left:8px;'>Private Source</span>" if page["private"] else ""
    
    html_items += f"""
        <li>
            <a href="{page['url']}" target="_blank">🔗 {page['name']}</a>{badge}
            <p>{page['description']}</p>
        </li>
    """

if not html_items:
    html_items = "<li>No active GitHub Pages sites found for this account.</li>"

# The structural HTML template
html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{USERNAME} Portfolio Directory</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 0 20px;
            background-color: #f6f8fa;
            color: #24292e;
        }}
        h1 {{
            border-bottom: 2px solid #e1e4e8;
            padding-bottom: 10px;
            color: #0366d6;
        }}
        ul {{
            list-style-type: none;
            padding: 0;
        }}
        li {{
            background: #ffffff;
            margin: 15px 0;
            padding: 20px;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            transition: transform 0.2s;
        }}
        li:hover {{
            transform: translateY(-2px);
            border-color: #0366d6;
        }}
        a {{
            color: #0366d6;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.2em;
        }}
        a:hover {{
            text-decoration: underline;
        }}
        p {{
            color: #586069;
            margin: 8px 0 0 0;
            font-size: 0.95em;
        }}
    </style>
</head>
<body>
    <h1>{USERNAME}.github.io Portfolio Directory</h1>
    <ul>
        {html_items}
    </ul>
</body>
</html>
"""

# 5. Overwrite the index.html file locally in the runner
with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Successfully generated new index.html file.")
