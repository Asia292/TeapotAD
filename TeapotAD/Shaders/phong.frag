#version 430

in vec3 vertPos;
in vec3 N;
in vec3 lightPos;
/*TODO:: Complete your shader code for a full Phong shading*/ 


struct lightVars
{
	 vec3 Kd;            // Diffuse reflectivity
	 vec3 Ka;
	 vec3 Ks;
	 vec3 Ld;            // Diffuse light intensity
	 vec3 La;
	 vec3 Ls;
};

uniform lightVars vars;

uniform vec3 view;

// complete to a full phong shading
layout( location = 0 ) out vec4 FragColour;

void main() {

   //Calculate the light vector
   vec3 L = normalize(lightPos - vertPos);  //What is this code doing?
    
   //calculate Diffuse Light Intensity making sure it is not negative and is clamped 0 to 1  
   vec4 Id = vec4(vars.Kd,1.0)*vec4(vars.Ld,1.0) * max(dot(N,L), 0.0);// Why do we need vec4(vec3)?

   Id = clamp(Id, 0.0, 1.0); // What is the role of clamp function? Why do we need it? 


   //ambaitn
   vec4 Ia = vec4(vars.La, 1.0) * vec4(vars.Ka, 1.0);
   Ia = clamp(Ia, 0.0, 1.0);


   //speculat
   vec3 sth = normalize(view - vertPos);
   vec3 R = (reflect(-L, N));
   float cosP = dot(sth, R);

   vec4 Is = (vec4(vars.Ls, 1.0) * vec4(vars.Ks, 1.0)) * pow(cosP, 100);
   Is = clamp(Is, 0.0, 1.0);


   //Multiply the Reflectivity by the Diffuse intensity
   FragColour =  Ia + Id + Is;

}
