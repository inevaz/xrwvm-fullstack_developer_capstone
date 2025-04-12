from django.contrib import admin
from .models import CarMake, CarModel

# Versión explícita (elimina cualquier decorador previo)
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'year', 'type')

admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)