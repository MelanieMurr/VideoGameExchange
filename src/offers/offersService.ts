import { createDbConnection } from "../db/utils";
import { offers, games } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { Offer, OfferStatus } from "./offer";

