import os
import importlib
services = {}

for module in os.listdir(os.path.dirname(os.path.realpath(__file__))):
    if module == '__init__.py' or module[-3:] != '.py':
        continue

    lib = importlib.import_module('services.'+module[:-3],)
    obj = lib.get_object()
    services[obj.id] = obj