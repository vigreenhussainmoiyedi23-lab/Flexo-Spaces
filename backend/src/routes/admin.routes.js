const { Router } = require('express');
const router = Router();

const { GetAllUsersHandler, GetAllListingsHandler, BanOrUnbanUserHandler, RemoveOrRestoreListingHandler, GetPlatformOverviewHandler } = require('../controllers/admin.controller');
const { isAdmin } = require('../middlewares/AdminProtectedMiddleware');

// ===== MANAGEMENT =====
router.get("/users", GetAllUsersHandler);
router.get("/listings", GetAllListingsHandler);

// ===== ANALYTICS =====
router.get("/analytics", GetPlatformOverviewHandler)

router.patch("/user/:userId", isAdmin, BanOrUnbanUserHandler);       // ban/unban
router.patch("/listing/:listingId", isAdmin, RemoveOrRestoreListingHandler); // remove/restore

module.exports = router;