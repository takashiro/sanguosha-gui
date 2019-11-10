
export default function ChoosePlayer(options) {
	const locker = this.lock();

	const { feasible } = options;
	const dashboard = this.getDashboard();

	const onSelectedPlayerChanged = (player) => {
		const selected = player.isSelected();
		this.reply(locker, { player: player.getSeat(), selected });
	};
	this.once('selectedPlayerChanged', onSelectedPlayerChanged);

	const onConfirmClicked = () => {
		this.off('selectedPlayerChanged', onSelectedPlayerChanged);
		this.reply(locker, { confirm: true });
	};
	if (feasible) {
		dashboard.once('confirm', onConfirmClicked);
	}
	dashboard.setConfirmEnabled(feasible);

	const onCancelClicked = () => {
		this.off('selectedPlayerChanged', onSelectedPlayerChanged);
		this.resetSelection();
		this.reply(locker, { cancel: true });
	};
	dashboard.once('cancel', onCancelClicked);
	dashboard.setCancelEnabled(true);

	this.once('lockerChanged', () => {
		this.off('selectedPlayerChanged', onSelectedPlayerChanged);
		dashboard.off('confirm', onConfirmClicked);
		dashboard.off('cancel', onCancelClicked);
	});

	const { candidates } = options;
	for (const player of this.getPlayers()) {
		if (!player.isSelected()) {
			player.setSelectable(candidates.includes(player.getSeat()));
		}
	}
	this.setSelectable(true);
}
