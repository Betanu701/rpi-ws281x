
git-revert:
	git reset --hard HEAD

git-pull: 
	git pull

git-commit:
	git add -A && git commit -m '-' && git push

goto-github:
	open https://github.com/giacomo/rpi-ws281x

goto-npm:
	open https://www.npmjs.com/package/rpi-ws281x-v2

npm-publish:
	npm publish
