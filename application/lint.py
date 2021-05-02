from pylint.lint import Run
import os

list_modules=os.listdir()
for module_name in list_modules:
    Run([module_name], do_exit=False)
