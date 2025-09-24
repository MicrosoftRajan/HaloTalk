Full STACk Project

1.
Backend crate folder and Frontend

2. In Backend Create a server.js file -> entry Point -> express

3. create 2 More folder 
            |_routes -> auth.router.js -> express.Route ka user kar Routes BanaDege
            |_controller -> auth.controller.js -> function for routes aur import kar dege routes

**Synchronous (sync) code में Code ऊपर से नीचे step by step execute होता है। एक काम पूरा होने तक अगला काम नहीं चलता।**

**async ek kaam chal raha hai saath hi saath dusra kamm bhi hota rahe ga**



user->click login -> send req -> req to (api/auth/signup or api/auth/login ) -> create a user to DB -> Genrate JWT -> send back to user in cookies -> now user is authenticate 

openssl rand -base64 32 - generate a JWT


# Common 
res.cookies("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly:true, // prevent XSS Attack
            sameSite:"strict", // prevent CSRF Attack
            secure: process.env.NODE_ENV === "production"
        })



# How to Use Postman

# protectedRoute

user authenticated -> send a token in cookie -> user cookie -> send another request -> request(cookie) -> validate cookie -> success



// Frontend

App.css, assets - delete


// setup axios and tanstack a lib that TanStack Query (pehle React Query) ek library hai jo data fetching, caching, synchronization aur state management ko simplify karti hai. Normal React apps me agar tum API se data fetch karte ho to tumhe manually ye sab handle karna padta hai:

Loading state banana

Error state handle karna

Cache maintain karna

Refetch kab karna hai decide karna

Background me data fresh rakhna

Ye sab kaafi repetitive aur complex ho jata hai.
TanStack Query in sabko automate aur optimize kar deta hai.
