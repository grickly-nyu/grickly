include .env
export

.DEFAULT_GOAL = help

help:
	@echo "---------------HELP-----------------"
	@echo "To setup the project type make setup"
	@echo "To run the project type make run"
	@echo "To test the project type make test"
	@echo "To doc the project type make doc"
	@echo "To prod the project type make prod"
	@echo "------------------------------------"

setup:
	pip install -r requirements.txt
	cd static && npm install

test:
	python test.py --cov-report term --cov=application tests/
	pylint application
	
run:
	export DATABASE_URL= DATABASE_URI_base && python manage.py runserver &
	cd static && npm start
	
doc:
	export PYTHONPATH="$PWD"
	python -m pydoc -b

prod:
	make test
	git push
