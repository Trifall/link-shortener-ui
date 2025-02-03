<script>
	import { GlobalKeyState } from '@/lib/KeyState.svelte';
	import {
		deleteKeyCookie,
		loadKeyCookie,
		loadSettings,
		saveKeyCookie,
		saveSettings
	} from '@/lib/Settings';
	import { Checkbox } from 'flowbite-svelte';

	let settings = $state(loadSettings());

	// Load saved key on component mount
	const savedKey = loadKeyCookie();

	if (savedKey) {
		GlobalKeyState.key = savedKey;
	}

	// save handler
	function handleSave() {
		saveSettings(settings);

		if (settings.saveKey) {
			saveKeyCookie(GlobalKeyState.key);
		} else {
			deleteKeyCookie();
		}
	}
</script>

<div class="flex w-full flex-col">
	<span class="text-xl font-semibold">Settings</span>
	<hr class="mb-4" />
	<div class="flex flex-col pl-4">
		<Checkbox
			defaultChecked
			bind:checked={settings.saveKey}
			id="save-key-checkbox"
			class="text-base"
		>
			Save key to cookies?
		</Checkbox>
	</div>

	<button
		onclick={handleSave}
		class="mt-4 max-w-32 rounded-lg bg-blue-600 py-1 text-white transition-colors hover:bg-blue-700"
	>
		Save Settings
	</button>
</div>
