from django.shortcuts import render,redirect
from django.views import View
import json
from django.http import JsonResponse
from django.contrib.auth.models import User
from validate_email import validate_email
from django.contrib import messages
from django.core.mail import EmailMessage

from django.urls import reverse

from django.utils.encoding import force_bytes,force_str,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from .utils import tokengenerator



# Create your views here.

class RegistrationView(View):
    def get(self,request):
        return render(request,'authentication/register.html')
    def post(self,request):
        #get user data
        #validate
        #creat acount

        username=request.POST['username']
        email=request.POST['email']
        password=request.POST['password']

        responce={
            'responce':request.POST
        }

        if not User.objects.filter(username=username).exists():
            if not User.objects.filter(email=email).exists():
                if len(password)<8:
                    messages.error(request,"password too short")
                    return render(request,'authentication/register.html',responce)

                user=User.objects.create_user(username=username,email=email)
                user.set_password(password)
                user.is_active=False
                user.save()
                uidb64=urlsafe_base64_encode(force_bytes(user.pk))
                domain=get_current_site(request).domain
                link=reverse('activate',kwargs={'uidb64':uidb64,'token':tokengenerator.make_token(user)})
                activate_link=f'http//{domain}{link}'
                email_subject="activate your account"

                email_body=f'Hi {username} \n please activate your account \n {activate_link}'
                email = EmailMessage(
                    email_subject,
                    email_body,
                    'noreply@semycolon.com',
                    [email],
                    )
                
                email.send(fail_silently=False)
                messages.success(request, 'Account creates succesfuly')
                return render(request,'authentication/register.html')



        return render(request,'authentication/register.html')

class VerificationView(View):
    def get(self,request,uidb64,token):
        return redirect('login')
        
class LoginView(View):
    def get(self,request):
        return render(request,'authentication/login.html')











class UsernameValidationView(View):
    def post(self,request):
        data=json.loads(request.body)
        username=data['username']
        if not str(username).isalnum():
            return JsonResponse({"username_error":"username should only contain alphanumeric character"},status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({"username_error":"sorry username in use,choose another one"},status=409)
        return JsonResponse({"username_valide":True})


class EmailValidationView(View):
    def post(self,request):
        data=json.loads(request.body)
        email=data['email']
        if not validate_email(email):
            return JsonResponse({"email_error":"email is invalid"},status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"email_error":"sorry email in use"},status=409)
        return JsonResponse({"email_valide":True})







