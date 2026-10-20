// Generated from authored map BoxColliders by PlantZoneExport. Re-export after map edits.
#pragma once
#include <cmath>
#include <string>
namespace PlantZones {
struct Zone { const char* map; float inverse[12]; float center[3]; float half[3]; };
inline constexpr Zone zones[] = {
{"TestMap", {0.131690383f,0.0f,0.0f,-2.62854004f,0.0f,1.71247542f,0.0f,-3.08245564f,0.0f,0.0f,0.0598474704f,2.24068928f}, {0.0f,0.0f,0.0f}, {0.5f,0.5f,0.5f}},
{"TestMap", {0.085623771f,0.0f,0.0f,-2.15472221f,0.0f,1.71247542f,0.0f,2.02072096f,0.0f,0.0f,0.085623771f,-3.06533098f}, {0.0f,0.0f,0.0f}, {0.5f,0.5f,0.5f}},
{"Desert", {0.100000001f,0.0f,0.0f,-2.72199988f,0.0f,2.0f,0.0f,-0.519999981f,0.0f,0.0f,0.0833333358f,1.93666673f}, {0.0f,0.0f,0.0f}, {0.5f,0.5f,0.5f}},
{"Desert", {-1.48673012E-08f,0.0f,0.124715976f,1.35067368f,0.0f,2.0f,0.0f,0.460000008f,-0.0773054138f,0.0f,-9.21552257E-09f,-1.64196706f}, {0.0f,0.0f,0.0f}, {0.5f,0.5f,0.5f}},
};
inline bool Contains(const std::string& map, float x, float y, float z) {
if (!std::isfinite(x)||!std::isfinite(y)||!std::isfinite(z)) return false;
for (const auto& zone : zones) { if (map != zone.map) continue; bool inside=true;
for(int r=0;r<3;r++){ const float* m=zone.inverse+r*4; float local=m[0]*x+m[1]*y+m[2]*z+m[3]; if(std::abs(local-zone.center[r])>zone.half[r]+std::abs(m[1])*0.75f+0.001f) inside=false; }
if(inside) return true; } return false; }
}
