"use babel";
/* globals atom */

import gitCmd from "../../lib/git-cmd";
import { getFilePath, removeGitRoot, createGitRoot } from "../fixtures";

// this is needed for jasmine-promises https://github.com/matthewjh/jasmine-promises/issues/8
global.jasmineRequire = {};
require("jasmine-promises");

describe("git.cmd", function () {

	beforeEach(async function () {
		await atom.packages.activatePackage("context-git");
		createGitRoot();
		this.gitRoot = getFilePath();
		atom.project.setPaths([this.gitRoot]);
	});

	afterEach(function () {
		removeGitRoot();
	});

	it("should call git", async function () {
		let error;
		try {
			await gitCmd.cmd(this.getRoot);
		} catch (ex) {
			error = ex;
		}
		expect(error).toContain("usage: git [--version]");
	});

	it("should call git with the args", async function () {
		let error;
		try {
			await gitCmd.cmd(this.getRoot, ["test"]);
		} catch (ex) {
			error = ex;
		}
		expect(error).toContain("git: 'test' is not a git command.");
	});

	it("should reject on error", async function () {
		let rejected;
		try {
			await gitCmd.cmd(this.getRoot, ["test"]);
		} catch (ex) {
			rejected = true;
		}
		expect(rejected).toBeTruthy();
	});

	it("should resolve on non-error", async function () {
		let resolved;
		try {
			await gitCmd.cmd(this.getRoot, ["init"]);
			resolved = true;
		} catch (ex) {}
		expect(resolved).toBeTruthy();
	});

});
