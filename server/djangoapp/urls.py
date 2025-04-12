# Uncomment the imports before you add the code
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings


app_name = 'djangoapp'
urlpatterns = [
    path('login/', views.login_user, name='login'),  # Ruta para iniciar sesión
    path('logout/', views.logout_user, name='logout'),  # Ruta para cerrar sesión
    # path(route='register/', view=views.registro, name='register'),  # Ruta para registrar un usuario
    # path for dealer reviews view

    # path for add a review view
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
