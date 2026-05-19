const { Router } = require('express');
const router = Router();

const { GetAllUsersHandler, GetAllListingsHandler, GetAllSwapsHandler, BanOrUnbanUserHandler, RemoveOrRestoreListingHandler, ResolveDisputeHandler, GetPlatformOverviewHandler, GetAllDisputesHandler } = require('../controllers/admin.controller');
const { isAdmin } = require('../middlewares/AdminProtectedMiddleware');

// ===== MANAGEMENT =====
router.get("/users", GetAllUsersHandler);
router.get("/listings", GetAllListingsHandler);
router.get("/swaps", GetAllSwapsHandler);
router.get("/disputes", GetAllDisputesHandler);

// ===== ANALYTICS =====
router.get("/analytics", GetPlatformOverviewHandler)

router.patch("/user/:userId", isAdmin, BanOrUnbanUserHandler);       // ban/unban
router.patch("/listing/:listingId", isAdmin, RemoveOrRestoreListingHandler); // remove/restore
router.patch("/dispute/:disputeId", isAdmin, ResolveDisputeHandler);   // resolve/reject

module.exports = router;