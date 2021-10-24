import Canvas from "canvas";
import Util from "./Util";
import assets from "./Assets";
import { Activity } from "discord.js";

class Profile {
	data: {
		width: number;
		height: number;
		background: { type: string; image: string };
		progressBar: {
			rounded: boolean;
			x: number;
			y: number;
			height: number;
			width: number;
			track: { color: string };
			bar: { type: string; color: string[] | string };
		};
		overlay: { display: boolean; level: number; color: string };
		avatar: {
			source: string | null;
			x: number;
			y: number;
			height: number;
			width: number;
		};
		status: {
			width: boolean | number;
			type: string;
			color: string;
			circle: boolean;
		};
		rank: {
			display: boolean;
			data: number;
			textColor: string;
			color: string;
			displayText: string;
		};
		level: {
			display: boolean;
			data: number;
			textColor: string;
			color: string;
			displayText: string;
		};
		currentXP: { data: number; color: string };
		requiredXP: { data: number; color: string };
		discriminator: { discrim: string | number | null; color: string };
		userId: { data: string | number | null; color: string };
		username: { name: string | null; color: string };
		birthday: { value: string | null; color: string };
		cash: { amount: number | null; color: string };
		activity: {
			array: { type: string; state: any; emoji: any }[] | null;
			color: string;
		};
		createdAt: { date: string | null; color: string };
		joinedAt: { date: string | null; color: string };
		perms: { perms: string | null; color: string };
		renderEmojis: boolean;
	};
	constructor() {
		this.data = {
			width: 934,
			height: 564,
			background: {
				type: "color",
				image: "#23272A",
			},
			progressBar: {
				rounded: true,
				x: 275.5,
				y: 183.75,
				height: 37.5,
				width: 596.5,
				track: {
					color: "#484b4E",
				},
				bar: {
					type: "color",
					color: "#EB1629",
				},
			},
			overlay: {
				display: true,
				level: 0.5,
				color: "#333640",
			},
			avatar: {
				source: null,
				x: 70,
				y: 50,
				height: 180,
				width: 180,
			},
			status: {
				width: 5,
				type: "online",
				color: "#43B581",
				circle: true,
			},
			rank: {
				display: true,
				data: 1,
				textColor: "#FFFFFF",
				color: "#F3F3F3",
				displayText: "RANK",
			},
			level: {
				display: true,
				data: 1,
				textColor: "#FFFFFF",
				color: "#F3F3F3",
				displayText: "LEVEL",
			},
			currentXP: {
				data: 0,
				color: "#FFFFFF",
			},
			requiredXP: {
				data: 0,
				color: "#FFFFFF",
			},
			discriminator: {
				discrim: null,
				color: "rgba(255, 255, 255, 0.4)",
			},
			userId: {
				data: null,
				color: "rgba(255, 255, 255, 0.4)",
			},
			username: {
				name: null,
				color: "#FFFFFF",
			},
			birthday: {
				value: null,
				color: "#FFFFFF",
			},
			cash: {
				amount: null,
				color: "#EB1629",
			},
			activity: {
				array: null,
				color: "#FFFFFF",
			},
			createdAt: {
				date: null,
				color: "#FFFFFF",
			},
			joinedAt: {
				date: null,
				color: "#FFFFFF",
			},
			perms: {
				perms: null,
				color: "#FFFFFF",
			},
			renderEmojis: true,
		};

		this.registerFonts();
	}

	registerFonts(fontArray: any[] = []) {
		if (!fontArray.length) {
			setTimeout(() => {
				Canvas.registerFont(assets("FONT").MANROPE_BOLD, {
					family: "Manrope",
					weight: "bold",
					style: "normal",
				});

				Canvas.registerFont(assets("FONT").MANROPE_REGULAR, {
					family: "Manrope",
					weight: "regular",
					style: "normal",
				});

				Canvas.registerFont(assets("FONT").NOTOSANS, {
					family: "NotoSans",
					weight: "bold",
					style: "normal",
				});
			}, 250);
		} else {
			fontArray.forEach((font) => {
				Canvas.registerFont(font.path, font.face);
			});
		}

		return this;
	}

	renderEmojis(apply = false) {
		this.data.renderEmojis = !!apply;
		return this;
	}

	setUsername(name: string, color = "#FFFFFF") {
		if (typeof name !== "string")
			throw new Error(
				`Expected username to be a string, received ${typeof name}!`,
			);
		this.data.username.name = name;
		this.data.username.color =
			color && typeof color === "string" ? color : "#FFFFFF";
		return this;
	}
	setBirthDay(value: string, color = "#FFFFFF") {
		if (typeof value !== "string")
			throw new Error(
				`Expected birthday to be a string, received ${typeof value}!`,
			);
		this.data.birthday.value = value;
		this.data.birthday.color =
			color && typeof color === "string" ? color : "#FFFFFF";
		return this;
	}

	setDiscriminator(
		discriminator: string | number | null,
		color = "rgba(255, 255, 255, 0.4)",
	) {
		this.data.discriminator.discrim =
			!isNaN(discriminator as number) && `${discriminator}`.length === 4
				? discriminator
				: null;
		this.data.discriminator.color =
			color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
		return this;
	}
	setActivities(array: Activity[], color = "rgba(255, 255, 255, 0.4)") {
		this.data.activity.array = array ? array : null;
		this.data.activity.color =
			color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
		return this;
	}

	setId(id: string | number | null, color = "rgba(255, 255, 255, 0.4)") {
		this.data.userId.data =
			!isNaN(id as number) && `${id}`.length === 18 ? id : null;
		this.data.userId.color =
			color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
		return this;
	}
	setCreatedAt(date: string, color = "rgba(255, 255, 255, 0.4)") {
		this.data.createdAt.date = date;
		this.data.createdAt.color =
			color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
		return this;
	}
	setPerms(perms: string | null, color = "rgba(255, 255, 255, 0.4)") {
		this.data.perms.perms = perms;
		this.data.perms.color =
			color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
		return this;
	}
	setJoinedAt(date: string, color = "rgba(255, 255, 255, 0.4)") {
		this.data.joinedAt.date = date;
		this.data.joinedAt.color =
			color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
		return this;
	}

	setProgressBar(color: string | string[], fillType = "COLOR", rounded = true) {
		switch (fillType) {
			case "COLOR":
				if (typeof color !== "string")
					throw new Error(
						`Color type must be a string, received ${typeof color}!`,
					);
				this.data.progressBar.bar.color = color;
				this.data.progressBar.bar.type = "color";
				this.data.progressBar.rounded = !!rounded;
				break;
			case "GRADIENT":
				if (!Array.isArray(color))
					throw new Error(
						`Color type must be Array, received ${typeof color}!`,
					);
				this.data.progressBar.bar.color = color.slice(0, 2);
				this.data.progressBar.bar.type = "gradient";
				this.data.progressBar.rounded = !!rounded;
				break;
			default:
				throw new Error(`Unsupported progressbar type "${fillType}"!`);
		}

		return this;
	}

	setProgressBarTrack(color: string) {
		if (typeof color !== "string")
			throw new Error(
				`Color type must be a string, received "${typeof color}"!`,
			);
		this.data.progressBar.track.color = color;

		return this;
	}

	setOverlay(color: string, level = 0.8, display = true) {
		if (typeof color !== "string")
			throw new Error(
				`Color type must be a string, received "${typeof color}"!`,
			);
		this.data.overlay.color = color;
		this.data.overlay.display = !!display;
		this.data.overlay.level = level && typeof level === "number" ? level : 0.8;
		return this;
	}

	setRequiredXP(data: number, color = "#FFFFFF") {
		if (typeof data !== "number")
			throw new Error(
				`Required xp data type must be a number, received ${typeof data}!`,
			);
		this.data.requiredXP.data = data;
		this.data.requiredXP.color =
			color && typeof color === "string" ? color : "#FFFFFF";
		return this;
	}

	setCash(data: number, color = "#FFFFFF") {
		if (typeof data !== "number")
			throw new Error(
				`Cash data type must be a number, received ${typeof data}!`,
			);
		this.data.cash.amount = data;
		this.data.cash.color = color;
		return this;
	}

	setCurrentXP(data: number, color = "#FFFFFF") {
		if (typeof data !== "number")
			throw new Error(
				`Current xp data type must be a number, received ${typeof data}!`,
			);
		this.data.currentXP.data = data;
		this.data.currentXP.color =
			color && typeof color === "string" ? color : "#FFFFFF";
		return this;
	}

	setRank(data: number, text = "RANK", display = true) {
		if (typeof data !== "number")
			throw new Error(`Level data must be a number, received ${typeof data}!`);
		this.data.rank.data = data;
		this.data.rank.display = !!display;
		if (!text || typeof text !== "string") text = "RANK";
		this.data.rank.displayText = text;

		return this;
	}

	setRankColor(text = "#FFFFFF", number = "#FFFFFF") {
		if (!text || typeof text !== "string") text = "#FFFFFF";
		if (!number || typeof number !== "string") number = "#FFFFFF";
		this.data.rank.textColor = text;
		this.data.rank.color = number;
		return this;
	}

	setLevelColor(text = "#FFFFFF", number = "#FFFFFF") {
		if (!text || typeof text !== "string") text = "#FFFFFF";
		if (!number || typeof number !== "string") number = "#FFFFFF";
		this.data.level.textColor = text;
		this.data.level.color = number;
		return this;
	}

	setLevel(data: number, text = "Level", display = true) {
		if (typeof data !== "number")
			throw new Error(`Level data must be a number, received ${typeof data}!`);
		this.data.level.data = data;
		this.data.level.display = !!display;
		if (!text || typeof text !== "string") text = "LEVEL";
		this.data.level.displayText = text;

		return this;
	}

	setCustomStatusColor(color: string) {
		if (!color || typeof color !== "string") throw new Error("Invalid color!");
		this.data.status.color = color;
		return this;
	}

	setStatus(status: any, circle = true, width: number | boolean = 5) {
		switch (status) {
			case "online":
				this.data.status.type = "online";
				this.data.status.color = "#43B581";
				break;
			case "idle":
				this.data.status.type = "idle";
				this.data.status.color = "#FAA61A";
				break;
			case "dnd":
				this.data.status.type = "dnd";
				this.data.status.color = "#F04747";
				break;
			case "offline":
				this.data.status.type = "offline";
				this.data.status.color = "#747F8E";
				break;
			case "streaming":
				this.data.status.type = "streaming";
				this.data.status.color = "#593595";
				break;
			default:
				this.data.status.type = "offline";
				this.data.status.color = "#747F8E";
		}

		if (width !== false)
			this.data.status.width = typeof width === "number" ? width : 5;
		else this.data.status.width = false;
		if ([true, false].includes(circle)) this.data.status.circle = circle;

		return this;
	}

	setBackground(type: any, data: string) {
		if (!data) throw new Error("Missing field : data");
		switch (type) {
			case "COLOR":
				this.data.background.type = "color";
				this.data.background.image =
					data && typeof data === "string" ? data : "#23272A";
				break;
			case "IMAGE":
				this.data.background.type = "image";
				this.data.background.image = data;
				break;
			default:
				throw new Error(`Unsupported background type "${type}"`);
		}

		return this;
	}

	setAvatar(data: string) {
		if (!data) throw new Error(`Invalid avatar type "${typeof data}"!`);
		this.data.avatar.source = data;
		return this;
	}

	async build(ops = { fontX: "NotoSans", fontY: "NotoSans" }) {
		if (typeof this.data.currentXP.data !== "number")
			throw new Error(
				`Expected currentXP to be a number, received ${typeof this.data
					.currentXP.data}!`,
			);
		if (typeof this.data.requiredXP.data !== "number")
			throw new Error(
				`Expected requiredXP to be a number, received ${typeof this.data
					.requiredXP.data}!`,
			);
		if (!this.data.avatar.source) throw new Error("Avatar source not found!");
		if (!this.data.username.name) throw new Error("Missing username");

		let bg = null;
		if (this.data.background.type === "image")
			bg = await Canvas.loadImage(this.data.background.image);
		let avatar = await Canvas.loadImage(this.data.avatar.source);

		// create canvas instance
		const canvas = Canvas.createCanvas(this.data.width, this.data.height);
		const ctx = canvas.getContext("2d");

		// create background
		if (!!bg) {
			ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
		} else {
			ctx.fillStyle = this.data.background.image;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		// add overlay
		if (!!this.data.overlay.display) {
			ctx.globalAlpha = this.data.overlay.level || 1;
			ctx.fillStyle = this.data.overlay.color;
			ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
		}

		// reset transparency
		ctx.globalAlpha = 1;

		// draw username
		ctx.font = `bold 36px ${ops.fontX}`;
		ctx.fillStyle = this.data.username.color;
		ctx.textAlign = "start";
		const name = Util.shorten(this.data.username.name, 10);

		// apply username
		!this.data.renderEmojis
			? ctx.fillText(`${name}`, 257 + 18.5, 164)
			: await Util.renderEmoji(ctx, name, 257 + 18.5, 164);

		// draw birthday
		ctx.font = `bold 28px ${ops.fontX}`;
		ctx.fillStyle = this.data.birthday.color;
		ctx.textAlign = "start";
		let bd = this.data.birthday.value;
		ctx.fillText(`Birthday: ${bd}`, 257, 264);

		// draw created at
		ctx.font = `bold 28px ${ops.fontX}`;
		ctx.fillStyle = this.data.birthday.color;
		ctx.textAlign = "start";
		ctx.fillText(`Created at: ${this.data.createdAt.date}`, 257, 314);

		// draw joined at
		ctx.font = `bold 28px ${ops.fontX}`;
		ctx.fillStyle = this.data.birthday.color;
		ctx.textAlign = "start";
		ctx.fillText(`Joined at: ${this.data.joinedAt.date}`, 257, 364);

		// draw perms
		ctx.font = `bold 28px ${ops.fontX}`;
		ctx.fillStyle = this.data.birthday.color;
		ctx.textAlign = "start";
		ctx.fillText(`Current knowledge: ${this.data.perms.perms}`, 257, 414);

		// draw activities
		if (
			(
				this.data.activity.array as { type: string; state: any; emoji: any }[]
			)[0]
		) {
			ctx.font = `bold 28px ${ops.fontX}`;
			ctx.fillStyle = this.data.birthday.color;
			ctx.textAlign = "start";
			let acts = this.data.activity.array as {
				type: string;
				state: any;
				emoji: any;
			}[];
			let ActsDescription = "";
			acts.forEach((element: { type: string; state: any; emoji: any }) => {
				if (element.type === "CUSTOM_STATUS") {
					if (element.state) {
						let emoji;
						if (element.emoji) emoji = element.emoji;
						ActsDescription = `${emoji ? emoji.name : " "}${element.state}`;
					}
				}
			});
			if (ActsDescription !== "")
				await Util.renderEmoji(
					ctx,
					`Custom status:\n${ActsDescription}`,
					257,
					464,
				);
		}

		// draw discriminator
		if (!this.data.discriminator.discrim)
			throw new Error("Missing discriminator!");
		const discrim = `${this.data.discriminator.discrim}`;
		if (discrim) {
			ctx.font = `36px ${ops.fontY}`;
			ctx.fillStyle = this.data.discriminator.color;
			ctx.textAlign = "center";
			ctx.fillText(
				`#${discrim.substr(0, 4)}`,
				ctx.measureText(name).width + 20 + 335,
				164,
			);
		}

		// fill level
		if (this.data.level.display && !isNaN(this.data.level.data)) {
			ctx.font = `bold 36px ${ops.fontX}`;
			ctx.fillStyle = this.data.level.textColor;
			ctx.fillText(
				this.data.level.displayText,
				800 -
					//@ts-ignore
					ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data))).width,
				82,
			);

			ctx.font = `bold 32px ${ops.fontX}`;
			ctx.fillStyle = this.data.level.color;
			ctx.textAlign = "end";
			//@ts-ignore
			ctx.fillText(Util.toAbbrev(parseInt(this.data.level.data)), 860, 82);
		}
		// fill id
		if (!this.data.userId.data) throw new Error("Missing member id!");
		const id = `${this.data.userId.data}`;
		if (id) {
			ctx.font = `36px ${ops.fontY}`;
			ctx.fillStyle = this.data.userId.color;
			ctx.textAlign = "center";
			ctx.fillText(`${id.substr(0, 18)}`, 720, 520);
		}
		//fill cash
		ctx.font = `bold 32px ${ops.fontX}`;
		ctx.fillStyle = this.data.cash.color;
		ctx.textAlign = "end";
		ctx.fillText(
			//@ts-ignore
			`${Util.toAbbrev(parseInt(this.data.cash.amount))} Credits`,
			860,
			264,
		);

		// fill rank
		if (this.data.rank.display && !isNaN(this.data.rank.data)) {
			ctx.font = `bold 36px ${ops.fontX}`;
			ctx.fillStyle = this.data.rank.textColor;
			// ctx.fillText(this.data.rank.displayText, 800 - ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data)) || "-").width - 7 - ctx.measureText(this.data.level.displayText).width - 7 - ctx.measureText(Util.toAbbrev(parseInt(this.data.rank.data)) || "-").width, 82);

			ctx.font = `bold 32px ${ops.fontX}`;
			ctx.fillStyle = this.data.rank.color;
			ctx.textAlign = "end";
			// ctx.fillText(Util.toAbbrev(parseInt(this.data.rank.data)), 790 - ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data)) || "-").width - 7 - ctx.measureText(this.data.level.displayText).width, 82);
		}

		// show progress
		ctx.font = `bold 30px ${ops.fontX}`;
		ctx.fillStyle = this.data.requiredXP.color;
		ctx.textAlign = "start";
		ctx.fillText(
			"/ " + Util.toAbbrev(this.data.requiredXP.data),
			670 + ctx.measureText(Util.toAbbrev(this.data.currentXP.data)).width + 15,
			164,
		);

		ctx.fillStyle = this.data.currentXP.color;
		ctx.fillText(Util.toAbbrev(this.data.currentXP.data), 670, 164);

		// draw progressbar
		ctx.beginPath();
		if (!!this.data.progressBar.rounded) {
			// bg
			ctx.fillStyle = this.data.progressBar.track.color;
			ctx.arc(
				257 + 18.5,
				147.5 + 18.5 + 36.25,
				18.5,
				1.5 * Math.PI,
				0.5 * Math.PI,
				true,
			);
			ctx.fill();
			ctx.fillRect(257 + 18.5, 147.5 + 36.25, 615 - 18.5, 37.5);
			ctx.arc(
				257 + 615,
				147.5 + 18.5 + 36.25,
				18.75,
				1.5 * Math.PI,
				0.5 * Math.PI,
				false,
			);
			ctx.fill();

			ctx.beginPath();
			// apply color
			if (this.data.progressBar.bar.type === "gradient") {
				let gradientContext = ctx.createRadialGradient(
					this._calculateProgress,
					0,
					500,
					0,
					0,
					0,
				);
				//@ts-ignore
				this.data.progressBar.bar.color.forEach(
					(color: string, index: number) => {
						gradientContext.addColorStop(index, color);
					},
				);
				ctx.fillStyle = gradientContext;
			} else {
				//@ts-ignore
				ctx.fillStyle = this.data.progressBar.bar.color;
			}

			// progress bar
			ctx.arc(
				257 + 18.5,
				147.5 + 18.5 + 36.25,
				18.5,
				1.5 * Math.PI,
				0.5 * Math.PI,
				true,
			);
			ctx.fill();
			ctx.fillRect(257 + 18.5, 147.5 + 36.25, this._calculateProgress, 37.5);
			ctx.arc(
				257 + 18.5 + this._calculateProgress,
				147.5 + 18.5 + 36.25,
				18.75,
				1.5 * Math.PI,
				0.5 * Math.PI,
				false,
			);
			ctx.fill();
		} else {
			// progress bar
			//@ts-ignore
			ctx.fillStyle = this.data.progressBar.bar.color;
			ctx.fillRect(
				this.data.progressBar.x,
				this.data.progressBar.y,
				this._calculateProgress,
				this.data.progressBar.height,
			);

			// outline
			ctx.beginPath();
			ctx.strokeStyle = this.data.progressBar.track.color;
			ctx.lineWidth = 7;
			ctx.strokeRect(
				this.data.progressBar.x,
				this.data.progressBar.y,
				this.data.progressBar.width,
				this.data.progressBar.height,
			);
		}

		ctx.save();

		// circle
		ctx.beginPath();
		ctx.arc(125 + 10, 125 + 20, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		// draw avatar
		ctx.drawImage(
			avatar,
			35,
			45,
			this.data.avatar.width + 20,
			this.data.avatar.height + 20,
		);
		ctx.restore();

		// draw status
		if (!!this.data.status.circle) {
			ctx.beginPath();
			ctx.fillStyle = this.data.status.color;
			ctx.arc(215, 205, 20, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(135, 145, 100, 0, Math.PI * 2, true);
			ctx.strokeStyle = this.data.status.color;
			ctx.lineWidth = this.data.status.width as number;
			ctx.stroke();
		} else if (!this.data.status.circle && this.data.status.width !== false) {
			ctx.beginPath();
			ctx.arc(135, 145, 100, 0, Math.PI * 2, true);
			ctx.strokeStyle = this.data.status.color;
			ctx.lineWidth = this.data.status.width as number;
			ctx.stroke();
		}

		return canvas.toBuffer();
	}

	get _calculateProgress() {
		const cx = this.data.currentXP.data;
		const rx = this.data.requiredXP.data;

		if (rx <= 0) return 1;
		if (cx > rx) return this.data.progressBar.width;

		let width = (cx * 615) / rx;
		if (width > this.data.progressBar.width)
			width = this.data.progressBar.width;
		return width;
	}
}

export default Profile;
