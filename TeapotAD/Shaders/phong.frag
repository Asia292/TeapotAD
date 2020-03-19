#version 430

in vec3 vertPos;
in vec3 N;
in vec3 lightPos;
/*TODO:: Complete your shader code for a full Phong shading*/ 


struct ambiantVars
{
	 vec3 Ka;            // Amb reflectivity
	 vec3 La;            // amb light intensity
};

struct diffuseVars
{
	 vec3 Kd;            // Diffuse reflectivity
	 vec3 Ld;            // Diffuse light intensity
};

struct specularVars
{
	 vec3 Ks;            // Spec reflectivity
	 vec3 Ls;            // Spec light intensity
};

struct spotLight
{
	vec3 pos;
	vec3 dir;
	float cutOff;
	bool SpotLight;

};

uniform ambiantVars aVars;
uniform diffuseVars dVars;
uniform specularVars sVars;
uniform spotLight spotlight;


uniform vec3 view;

// complete to a full phong shading
layout( location = 0 ) out vec4 FragColour;

vec4 diffuse(vec3 light)
{
	vec4 Id = vec4(dVars.Kd,1.0)*vec4(dVars.Ld,1.0) * max(dot(N,light), 0.0);
	Id = clamp(Id, 0.0, 1.0);

	return Id;
}

vec4 ambiant()
{
	vec4 Ia = vec4(aVars.La, 1.0) * vec4(aVars.Ka, 1.0);
	Ia = clamp(Ia, 0.0, 1.0);

	return Ia;
}

vec4 specular(vec3 light)
{
	vec3 sth = normalize(view - vertPos);
	vec3 R = (reflect(-light, N));
	float cosP = dot(sth, R);

	vec4 Is = (vec4(sVars.Ls, 1.0) * vec4(sVars.Ks, 1.0)) * pow(cosP, 100);
	Is = clamp(Is, 0.0, 1.0);

	return Is;
}

float attenuation(float constant, float lin, float quad)
{
	float att = 1 / (constant + (lin * (distance(lightPos , vertPos)) + (quad * pow((distance(lightPos, vertPos)), 2))));

	return att;
}

void main() 
{

   //Calculate the light vector
   //vec3 L = normalize(spotlight.pos - vertPos);  //What is this code doing?

	if (spotlight.SpotLight)
		vec3 L = normalize(spotlight.pos - vertPos);
	else
		vec3 L = normalize(lightPos - vertPos);
  
  vec4 spec = specular(L);
  vec4 amb = ambiant();
  vec4 dif = diffuse(L);

	float atten = attenuation(1.0f, 0.001f, 0.001f);


   //Multiply the Reflectivity by the Diffuse intensity
  // FragColour =  amb + (atten*spec) + (atten*dif);

	if (spotlight.SpotLight)
	{
	   //spotlight
	   float angle = dot(normalize(spotlight.pos - vertPos), normalize(spotlight.dir)); 

	   if (angle < spotlight.cutOff)
			FragColour =  amb + (atten*spec) + (atten*dif);
	   else
			FragColour =  amb;
	}
	else
		FragColour =  amb + (atten*spec) + (atten*dif);
}
