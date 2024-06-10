import kaboom from "kaboom"

kaboom()

// Load sprites
loadSprite("bird", "sprites/bird.png")
loadSprite("bg", "sprites/bg.png")
loadSprite("pipe", "sprites/pipe.png")

// Load sounds
loadSound("jump", "sounds/jump.mp3")
loadSound("bruh", "sounds/bruh.mp3")
loadSound("pass", "sounds/pass.mp3")

scene("game", () => {
	const PIPE_GAP = 140
	let score = 0
	setGravity(1600)

	add([
		sprite("bg", { width: width(), height: height() })
	])

	const scoreText = add([text(score), pos(12, 12)])

	const player = add([
		sprite("bird"),
		scale(1.2),
		pos(100, 50),
		area(),
		body()
	])

	function createPipes() {
		const offset = rand(-50, 50)
		// bottom pipe
		add([
			sprite("pipe"),
			pos(width(), height() / 2 + offset + PIPE_GAP / 2),
			"pipe",
			scale(2),
			area(),
			{ passed: false }
		])
		// top pipe
		add([
			sprite("pipe", { flipY: true }),
			pos(width(), height() / 2 + offset - PIPE_GAP / 2),
			"pipe",
			anchor("botleft"),
			scale(2),
			area()
		])
	}

	loop(1.5, () => createPipes())

	onUpdate("pipe", (pipe) => {
		pipe.move(-300, 0)
		if (pipe.passed === false && pipe.pos.x < player.pos.x) {
			pipe.passed = true
			score += 1
			scoreText.text = score
			play("pass")
		}
	})

	player.onCollide("pipe", () => {
		const ss = screenshot()
		go("gameover", score, ss)
	})

	player.onUpdate(() => {
		if (player.pos.y > height()) {
			const ss = screenshot()
			go("gameover", score, ss)
		}
	})

	onKeyPress("space", () => {
		play("jump")
		player.jump(400)
	})

	window.addEventListener("touchstart", () => {
		play("jump")
		player.jump(400)
	})
})

scene("gameover", (score, screenshot) => {
	play("bruh")
	add([
		sprite("bg", { width: width(), height: height() }),
	])
	add([
		text("gameover!\n" + "score: " + score, { size: 45 }),
		pos(width() / 2, height() / 3)
	])
})

go("game")
