/*global describe,beforeEach,afterEach,it*/

import expect from 'expect.js';

import * as fixtures from './helpers/fixtures';
import Share from './../main';
let testShare;
let shareEl;

describe('general behaviour', () => {

	beforeEach(() => {
		fixtures.insertShareLinks();
		shareEl = document.querySelector('[data-o-component=o-share]');
		testShare = new Share(shareEl);
	});

	afterEach(() => {
		testShare.destroy();
		fixtures.reset();
	});

	it('is defined', () => {
		expect(typeof testShare).to.not.be('undefined');
	});

	it('initialisation', () => {
		expect(shareEl.hasAttribute('data-o-share--js')).to.be(true);
	});
});

describe('links', () => {
	let twitterLinkEl;
	let spy;

	beforeEach(() => {
		fixtures.insertShareLinks();
		shareEl = document.querySelector('[data-o-component=o-share]');
		testShare = new Share(shareEl);
		spy = newWindowSpy();
		window.open = spy.func;
		twitterLinkEl = document.querySelector('.o-share__action--twitter a');
		const ev = document.createEvent('Event');
		ev.initEvent('click', true, true);
		twitterLinkEl.dispatchEvent(ev);
	});

	afterEach(() => {
		testShare.destroy();
		fixtures.reset();
	});

	it('clicking link opens new window', () => {
		expect(spy.calledWith[0]).to.be(twitterLinkEl.getAttribute('href'));
		expect(spy.calledWith[1]).to.be('');
		expect(spy.calledWith[2]).to.be('width=646,height=436');
	});

	it('clicking link opens new window only once', () => {
		expect(spy.callCount).to.be(1);
		expect(spy.calledWith[0]).to.be(twitterLinkEl.getAttribute('href'));
		expect(spy.calledWith[1]).to.be('');
		expect(spy.calledWith[2]).to.be('width=646,height=436');
		const ev = document.createEvent('Event');
		ev.initEvent('click', true, true);
		twitterLinkEl.dispatchEvent(ev);
		expect(spy.callCount).to.be(1);
	});
});

describe('component', () => {
	let twitterLinkEl;
	let spy;

	beforeEach(() => {
		fixtures.insertShareComponent();
		shareEl = document.querySelector('[data-o-component=o-share]');
		new Share(shareEl);

		spy = newWindowSpy();
		window.open = spy.func;
	});

	it('generates markup when instantiating a component', () => {
		expect(document.querySelector('.o-share__action--twitter')).to.exist;
		expect(document.querySelector('.o-share__action--facebook')).to.exist;
		expect(document.querySelector('.o-share__action--linkedin')).to.exist;
		expect(document.querySelector('.o-share__action--whatsapp')).to.exist;
		expect(document.querySelector('.o-share__action--googleplus')).to.exist;
		expect(document.querySelector('.o-share__action--reddit')).to.exist;
		expect(document.querySelector('.o-share__action--pinterest')).to.exist;
		expect(document.querySelector('.o-share__action--url')).to.exist;
	});

	it('responds correctly to twitter clicks in the component', () => {
		const twitterLinkElement = document.querySelector('.o-share__action--twitter a');
		const event = document.createEvent('Event');
		event.initEvent('click', true, true);
		twitterLinkElement.dispatchEvent(event);

		expect(spy.callCount).to.be(1);
		expect(spy.calledWith[0]).to.be(twitterLinkElement.getAttribute('href'));
		expect(spy.calledWith[1]).to.be('');
		expect(spy.calledWith[2]).to.be('width=646,height=436');
	});

	it('responds correctly to url clicks in the component', () => {
		expect(document.querySelector('.o-share-tooltip')).not.to.exist;

		const urlLinkElement = document.querySelector('.o-share__action--url a');
		const event = document.createEvent('Event');
		event.initEvent('click', true, true);
		urlLinkElement.dispatchEvent(event);

		expect(document.querySelector('.o-share-tooltip')).to.exist;
		expect(document.querySelector('.o-share__action--url input').value).to.equal('https://www.ft.com/content/test');
	});
});

function newWindowSpy() {
	const self = {
		callCount: 0,
		calledWith: [],
		func: function() {
			self.callCount++;
			self.calledWith = arguments;

			return {
				focus: function() {}
			};
		}
	};

	return self;
}
