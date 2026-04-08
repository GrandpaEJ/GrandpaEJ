import os
import requests
import json

TOKEN = os.getenv("GH_TOKEN")
OWNER = os.getenv("GITHUB_OWNER", "GrandpaEJ")

HEADERS = {
    "Accept": "application/vnd.github.v3+json"
}
if TOKEN:
    HEADERS["Authorization"] = f"token {TOKEN}"

def get_repos():
    repos = []
    page = 1
    while True:
        res = requests.get(f"https://api.github.com/users/{OWNER}/repos?per_page=100&page={page}", headers=HEADERS)
        if res.status_code != 200:
            print(f"Error fetching repos: {res.status_code} - {res.text}")
            break
        data = res.json()
        if not data:
            break
        repos.extend(data)
        page += 1
    return repos

def get_languages(repos):
    lang_totals = {}
    for repo in repos:
        if repo.get("fork"):
            continue
        
        repo_name = repo.get("name")
        res = requests.get(f"https://api.github.com/repos/{OWNER}/{repo_name}/languages", headers=HEADERS)
        if res.status_code == 200:
            langs = res.json()
            for lang, bytes_count in langs.items():
                lang_totals[lang] = lang_totals.get(lang, 0) + bytes_count
        else:
            print(f"Failed to get languages for {repo_name}")
    return lang_totals

def get_colors():
    res = requests.get("https://raw.githubusercontent.com/ozh/github-colors/master/colors.json")
    if res.status_code == 200:
        return res.json()
    return {}

def generate_svg(top_langs, total_bytes, colors):
    line_height = 40
    start_y = 65
    width = 350
    
    height = start_y + (len(top_langs) * line_height) + 20
    
    lines_svg = []
    for i, (lang, bytes_count) in enumerate(top_langs):
        percent = (bytes_count / total_bytes) * 100
        color = colors.get(lang, {}).get("color", "#8b949e")
        if not color:
            color = "#8b949e"
            
        y = start_y + (i * line_height)
        
        # Calculate width of the foreground line (max width is 280)
        bar_width = min(280, max(2, (280 * percent) / 100))
        
        # Add slight animation delay to each bar
        delay = i * 0.2
        
        line_svg = f"""
    <g transform="translate(25, {y})">
      <circle cx="5" cy="-4" r="5" fill="{color}" />
      <text x="18" y="0" class="lang-name">{lang}</text>
      <text x="300" y="0" class="lang-percent" text-anchor="end">{percent:.1f}%</text>
      
      <!-- Progress Bar Background -->
      <line x1="0" y1="12" x2="300" y2="12" stroke="#21262d" stroke-width="8" stroke-linecap="round" />
      
      <!-- Progress Bar Foreground -->
      <line x1="0" y1="12" x2="{bar_width}" y2="12" stroke="{color}" stroke-width="8" stroke-linecap="round" />
    </g>"""
        lines_svg.append(line_svg)

    svg_content = f"""<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title {{ font-family: 'Segoe UI', Ubuntu, sans-serif; font-weight: 600; font-size: 16px; fill: #c9d1d9; }}
    .lang-name {{ font-family: 'Segoe UI', Ubuntu, sans-serif; font-weight: 400; font-size: 13px; fill: #8b949e; }}
    .lang-percent {{ font-family: 'Segoe UI', Ubuntu, sans-serif; font-weight: 600; font-size: 13px; fill: #c9d1d9; }}
    .bg {{ fill: #0d1117; stroke: #30363d; stroke-width: 1px; rx: 6px; }}
  </style>
  <rect class="bg" width="{width - 1}" height="{height - 1}" x="0.5" y="0.5" />
  <text x="25" y="35" class="title">Tech Stack</text>
  {''.join(lines_svg)}
</svg>"""

    os.makedirs("dist", exist_ok=True)
    with open("dist/tech-stack.svg", "w") as f:
        f.write(svg_content)
    print("Successfully generated dist/tech-stack.svg")

def main():
    print(f"Fetching repos for {OWNER}...")
    repos = get_repos()
    print(f"Found {len(repos)} repositories.")
    
    print("Fetching languages...")
    language_stats = get_languages(repos)
    
    total_bytes = sum(language_stats.values())
    if total_bytes == 0:
        print("No language data found!")
        return
        
    print("Fetching colors...")
    colors = get_colors()
    
    sorted_langs = sorted(language_stats.items(), key=lambda x: x[1], reverse=True)
    top_langs = sorted_langs[:6]
    
    print(f"Top languages: {[l[0] for l in top_langs]}")
    generate_svg(top_langs, total_bytes, colors)

if __name__ == "__main__":
    main()
