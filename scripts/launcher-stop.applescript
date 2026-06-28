tell application "Finder"
	set projectDir to POSIX path of (container of (path to me as alias))
end tell

set nodePath to "/Users/andrea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/andrea/Documents/ALBA/.pnpm-home:$PATH"
set commandText to "cd " & quoted form of projectDir & " && export PATH=" & quoted form of nodePath & " && pnpm run alba:down; exit"

tell application "Terminal"
	activate
	do script commandText
end tell
