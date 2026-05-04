import { Stack, TextField, MenuItem } from "@mui/material";
import raw from "china-area-data/data-array.json";
import { buildTree } from "@/utils/area";
// ⭐ 1️⃣ 放这里（组件外）


// ⭐ 2️⃣ 这里初始化（只执行一次）
const areas = buildTree(raw);

export default function AreaSelector({ value, onChange }: any) {
  const { province, city, district } = value;

  const provinceList = areas;

  const cityList =
    areas.find((p: any) => p.name === province)?.children || [];

  const districtList =
    cityList.find((c: any) => c.name === city)?.children || [];

  return (
    <Stack direction="row" spacing={1}>
      <TextField
        select
        label="Province"
        value={province || ""}
        onChange={(e) =>
          onChange({
            province: e.target.value,
            city: "",
            district: "",
          })
        }
        fullWidth
      >
        {provinceList.map((p: any) => (
          <MenuItem key={p.value} value={p.name}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="City"
        value={city || ""}
        onChange={(e) =>
          onChange({
            ...value,
            city: e.target.value,
            district: "",
          })
        }
        fullWidth
        disabled={!province}
      >
        {cityList.map((c: any) => (
          <MenuItem key={c.value} value={c.name}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="District"
        value={district || ""}
        onChange={(e) =>
          onChange({
            ...value,
            district: e.target.value,
          })
        }
        fullWidth
        disabled={!city}
      >
        {districtList.map((d: any) => (
          <MenuItem key={d.value} value={d.name}>
            {d.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}