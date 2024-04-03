// import NextAuth from "next-auth"

// export default NextAuth({
//     providers: [
//         // {
//         //     id: "ksu",
//         //     name: "Kansas State University",
//         //     type: "oauth",
//         //     wellKnown: "https://cas.k-state.edu/cas/oidc/.well-known/openid-configuration",
//         //     authorization: { params: { scope: "openid" } },
//         //     token: true,
//         //     checks: ["pkce", "state"],
//         //     profile: (profile) => {
//         //         return {
//         //             id: profile.sub,
//         //             name: profile.name,
//         //             email: profile.email,
//         //         };
//         //     },
//         // },
//         {
//             id: "google",
//             name: "Google",
//             type: "oauth",
//             wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
//             authorization: { params: { scope: "openid email profile" } },
//             token: true,
//             checks: ["pkce", "state"],
//             profile(profile) {
//               return {
//                 id: profile.sub,
//                 name: profile.name,
//                 email: profile.email,
//                 image: profile.picture,
//               }
//             },
//           }
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
//     session: {
//         strategy: "jwt",
//         maxAge: 60 * 60 * 24 * 30, // 30 days
//         updateAge: 24 * 60 * 60, // 24 hours

//     },
//     jwt: {
//         maxAge: 60 * 60 * 24 * 30,
//     },
//     useSecureCookies: true,
//     debug: true,
// });
