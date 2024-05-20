import { expect } from "detox"

import { openApp } from "./utils/openApp"

describe("Example", () => {
	beforeAll(async () => {
		await openApp()
	})

	// beforeEach(async () => {
	// 	await device.reloadReactNative()
	// })

	it("user can create a game", async () => {
		await waitFor(element(by.text("Create Game")))
			.toBeVisible()
			.withTimeout(1000)
			.then(async () => {
				await element(by.text("Create Game")).tap()
			})

		await waitFor(element(by.text("Sign In")))
			.toBeVisible()
			.withTimeout(1000)
			.then(async () => {
				await element(by.id("email-input"))
					.atIndex(0)
					.typeText("tefaveh805@ikumaru.com")

				await element(by.id("password-input"))
					.atIndex(0)
					.typeText("Password")

				await element(by.text("Sign In")).tap()
			})

		await waitFor(element(by.text("Confirm")))
			.toBeVisible()
			.withTimeout(2000)
			.then(async () => {
				await element(by.text("Confirm")).tap()
			})

		await waitFor(element(by.text("Create Game")))
			.toBeVisible()
			.withTimeout(5000)
			.then(async () => {
				await element(by.text("Create Game")).tap()

				expect(element(by.text("Start Game"))).toBeVisible()
			})
	})

	//Close the app

	afterAll(async () => {
		device.terminateApp()
	})
})
