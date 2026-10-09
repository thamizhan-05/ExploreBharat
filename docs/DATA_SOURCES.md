# ExploreBharat Data Source Integrity & Verification Architecture

## 1. National Data Sources

Every tourist attraction, monument, wildlife sanctuary, and temple within ExploreBharat is tagged with transparent provenance fields:

- `sourceType`: `GOVERNMENT_TOURISM` | `ASI` | `MINISTRY_OF_CULTURE` | `FOREST_DEPARTMENT` | `PARTNER` | `COMMUNITY`
- `sourceName`: e.g., "Archaeological Survey of India (ASI) Jaipur Circle"
- `sourceUrl`: Official government ticketing / information portal
- `verificationStatus`: `VERIFIED` | `PENDING_REVIEW` | `COMMUNITY_REPORTED`
- `lastVerifiedAt`: ISO timestamp of latest human or automated audit

---

## 2. Primary Government Authorities Represented

1. **Archaeological Survey of India (ASI):** Monuments of National Importance (e.g. Taj Mahal, Amber Palace, Red Fort, Qutub Minar, Konark Sun Temple, Hampi, Ajanta & Ellora Caves).
2. **Ministry of Tourism (Government of India):** Incredible India initiative guidelines and circuits.
3. **State Tourism Corporations:**
   - Rajasthan Tourism Development Corporation (RTDC)
   - Kerala Tourism Board
   - Maharashtra Tourism Development Corporation (MTDC)
   - Tamil Nadu Tourism Development Corporation (TTDC)
   - Goa Tourism Department
   - Himachal Tourism (HPTDC)
   - Uttarakhand Tourism Development Board
4. **Ministry of Environment, Forest and Climate Change (MoEFCC):** National Parks, Tiger Reserves, and Biosphere Sanctuaries (Jim Corbett, Kaziranga, Ranthambore, Sundarbans).
