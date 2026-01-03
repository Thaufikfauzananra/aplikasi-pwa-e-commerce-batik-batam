# ✅ PRODUCTION VERIFICATION CHECKLIST

## 🎯 Pre-Testing

- [ ] Both URLs accessible
  - Frontend: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app
  - Backend: https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app

---

## 🧪 Backend Tests

### Health Check
- [ ] `GET /api/health` returns 200
- [ ] Response contains `"status": "success"`
- [ ] Database connection shows `"database": "connected"`

**Command**:
```bash
curl https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api/health
```

### Hello Endpoint
- [ ] `GET /api/hello` returns 200
- [ ] Response shows "Halo dari Express Backend"

**Command**:
```bash
curl https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api/hello
```

---

## 🧪 Frontend Tests

### Page Load
- [ ] Frontend loads without console errors
- [ ] No CORS errors in DevTools
- [ ] No 404 for assets
- [ ] Page responsive on mobile

**Test**: 
1. Open: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app
2. Press F12 → Console
3. Should be clean (no red errors)

### Navigation
- [ ] Can access /register page
- [ ] Can access /login page
- [ ] Can access other routes
- [ ] Navigation works smooth

---

## 🧪 Registration Flow Tests

### Test 1: Valid Registration
**Data**:
```
Name: Test User
Email: test@vercelapp.com
Password: test@123456
Confirm: test@123456
Agree: ✓
```

**Expected**:
- [ ] Form submits
- [ ] No console errors (F12)
- [ ] 201 status in Network tab
- [ ] Token saved to localStorage
- [ ] Redirect to /Beranda
- [ ] Alert: "Registrasi berhasil!"

### Test 2: Invalid Email Format
**Data**:
```
Email: invalid-email
```

**Expected**:
- [ ] Error message: "email: The email must be a valid email address"
- [ ] Form not submitted
- [ ] No network request

### Test 3: Password Too Short
**Data**:
```
Password: test
Confirm: test
```

**Expected**:
- [ ] Error message: "password: The password must be at least 6 characters"
- [ ] Form not submitted

### Test 4: Password Mismatch
**Data**:
```
Password: test@123456
Confirm: test@654321
```

**Expected**:
- [ ] Error message: "password_confirmation: does not match"
- [ ] Form not submitted

### Test 5: Duplicate Email
**Data**:
```
Email: test@vercelapp.com  (same as Test 1)
```

**Expected**:
- [ ] Error message: "email: Email sudah terdaftar"
- [ ] 422 status
- [ ] No redirect

### Test 6: Network Error Simulation
**Steps**:
1. DevTools → Network tab → Offline
2. Try to register
3. Simulate network error

**Expected**:
- [ ] Error message: "Tidak bisa terhubung ke backend"
- [ ] Clear instructions for user

---

## 🧪 Post-Registration Tests

### Test 7: Login with New Account
**Data**:
```
Email: test@vercelapp.com
Password: test@123456
```

**Expected**:
- [ ] Login successful
- [ ] Token saved
- [ ] Redirect to /Beranda
- [ ] User profile shows correct name

### Test 8: Logout
**Steps**:
1. Go to profile page
2. Click logout

**Expected**:
- [ ] Confirmation alert appears
- [ ] Token removed from localStorage
- [ ] Redirect to /login
- [ ] Cannot access protected routes

### Test 9: Protected Routes
**Steps**:
1. Logout (token removed)
2. Try accessing /Beranda directly

**Expected**:
- [ ] Redirect to /login
- [ ] Cannot access without token

---

## 🔍 Network Tests

### Test 10: API URL Verification
**Open DevTools → Network tab:**

**Expected requests**:
- [ ] All API calls to: `https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api/*`
- [ ] No requests to localhost or old backend
- [ ] No 404 errors
- [ ] All responses have correct status codes

### Test 11: CORS Headers
**Check response headers**:
- [ ] `access-control-allow-origin: *`
- [ ] `access-control-allow-methods: GET,POST,PUT,DELETE`
- [ ] `access-control-allow-headers: Content-Type,Authorization`

---

## 💾 Database Tests

### Test 12: Data Persistence
**Steps**:
1. Register user
2. Refresh page
3. Login with same credentials
4. Check localStorage for user data

**Expected**:
- [ ] User data persists in database
- [ ] Can login with registered account
- [ ] User info shows correctly

---

## 🔐 Security Tests

### Test 13: JWT Token Validation
**Steps**:
1. Register & get token
2. DevTools → Console
3. Run: `console.log(localStorage.getItem('token'))`

**Expected**:
- [ ] Token exists
- [ ] Token format valid (3 parts, separated by dots)
- [ ] Token stored securely

### Test 14: Token Expiry
**Steps**:
1. Wait for token to expire (7 days)
2. Try to make API request

**Expected**:
- [ ] Get 403 Forbidden or 401 Unauthorized
- [ ] Redirect to login
- [ ] Need to login again

### Test 15: Password Hashing
**Steps**:
1. Check backend database
2. View user password field

**Expected**:
- [ ] Password is hashed (not plaintext)
- [ ] Uses bcryptjs hashing

---

## 📊 Performance Tests

### Test 16: Load Times
**Measure**:
- [ ] Frontend initial load: < 3s
- [ ] API response time: < 500ms
- [ ] No timeout issues

### Test 17: Mobile Responsiveness
**Test on**:
- [ ] Mobile phone (iOS/Android)
- [ ] Tablet
- [ ] Desktop

**Expected**:
- [ ] All pages responsive
- [ ] Touch events work
- [ ] No layout issues

---

## 📱 Browser Tests

**Test on**:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Expected**:
- [ ] Works on all modern browsers
- [ ] Consistent behavior
- [ ] No JS errors

---

## ✅ Final Verification

- [ ] All health checks pass
- [ ] Registration/login works
- [ ] No console errors
- [ ] No CORS errors
- [ ] API URLs correct
- [ ] Data persists
- [ ] Security measures in place
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Cross-browser compatible

---

## 📝 Sign-Off

**Date Tested**: _____________
**Tested By**: _____________
**Status**: ✅ READY / ❌ NEEDS FIX

**Issues Found**:
```
(List any issues found during testing)
```

**Notes**:
```
(Any additional notes or observations)
```

---

**If all tests pass**: ✅ PRODUCTION IS READY! 🚀
**If tests fail**: ❌ Check PRODUCTION_DEPLOYMENT.md troubleshooting
