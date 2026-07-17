# Rule: Prioritize Reference Docs & Previous Session Memories

When starting a session or when the user asks to "read the doc", the agent must prioritize existing documentation and memories before inspecting code:

1. **Check Previous Sessions**: Look in the CLI brain directory (`~/.gemini/antigravity-cli/brain/`) for markdown reference guides or architectural summaries (like `portfolio_architecture.md`) generated in previous sessions.
2. **Read Docs First**: Thoroughly read any reference documents or READMEs before reading or proposing changes to codebase files (such as `script.js`, `styles.css`, `index.html`).
3. **Acknowledge and Summarize**: State what documentation was read and confirm understanding before proceeding to look at the code or making edits.
4. **Auto-Start Server After Changes**: Always automatically start the local Python development server (using `python3 -m http.server 8000`, or falling back to `8001` if occupied) in the background whenever code or styling changes are made, so the user can immediately preview their changes.
5. **Auto-Shutdown Server at End of Session**: The project is configured with a lifecycle hook in `.agents/hooks.json` mapping the `Stop` event. This hook automatically executes `.agents/shutdown-server.sh` to terminate any running Python HTTP servers on ports 8000 and 8001 when the agent session concludes.
