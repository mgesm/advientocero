$outDir = "C:\Users\migue\.gemini\antigravity\scratch\advientocero\imagenes\suspects"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

$specs = @(
  @{ id='s01'; initials='BV'; accent='#F59E0B'; hair='bob'; accessory='earrings' },
  @{ id='s05'; initials='LM'; accent='#38BDF8'; hair='wavy'; accessory='scarf' },
  @{ id='s06'; initials='RP'; accent='#94A3B8'; hair='short-part'; accessory='tie' },
  @{ id='s07'; initials='NE'; accent='#BE123C'; hair='bun'; accessory='lapel' },
  @{ id='s10'; initials='JP'; accent='#F59E0B'; hair='buzz'; accessory='collar' },
  @{ id='s11'; initials='SN'; accent='#10B981'; hair='long'; accessory='stole' },
  @{ id='s12'; initials='DA'; accent='#38BDF8'; hair='curls'; accessory='glasses' },
  @{ id='s13'; initials='IC'; accent='#10B981'; hair='braid'; accessory='glasses' },
  @{ id='s17'; initials='PM'; accent='#38BDF8'; hair='wavy'; accessory='tunic' },
  @{ id='s18'; initials='GS'; accent='#F59E0B'; hair='short-part'; accessory='jacket' },
  @{ id='s19'; initials='EV'; accent='#BE123C'; hair='bob'; accessory='glasses' },
  @{ id='s22'; initials='RC'; accent='#94A3B8'; hair='receding'; accessory='glasses' },
  @{ id='s23'; initials='TA'; accent='#F59E0B'; hair='updo'; accessory='brooch' },
  @{ id='s24'; initials='MT'; accent='#FF2D55'; hair='buzz'; accessory='earpiece' },
  @{ id='s25'; initials='AO'; accent='#A855F7'; hair='bob'; accessory='shawl' }
)

function Get-HairPath($type) {
  switch ($type) {
    'bob'        { return '<path d="M114 148 C114 88 206 88 206 148 L212 192 C198 182 186 175 186 145 C172 132 148 132 134 145 C134 175 122 182 108 192 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    'wavy'       { return '<path d="M112 152 C112 86 208 86 208 152 C216 176 208 206 196 218 L184 180 C174 138 146 138 136 180 L124 218 C112 206 104 176 112 152 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    'long'       { return '<path d="M110 150 C110 86 210 86 210 150 L216 232 L188 232 L184 150 C170 132 150 132 136 150 L132 232 L104 232 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    'bun'        { return '<circle cx="160" cy="86" r="22" fill="#1E293B" stroke="#475569" stroke-width="2"/><path d="M118 145 C118 92 202 92 202 145 C186 128 134 128 118 145 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    'updo'       { return '<circle cx="160" cy="86" r="22" fill="#1E293B" stroke="#475569" stroke-width="2"/><path d="M118 145 C118 92 202 92 202 145 C186 128 134 128 118 145 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    'braid'      { return '<path d="M116 146 C116 88 204 88 204 146 C188 128 132 128 116 146 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/><rect x="194" y="168" width="14" height="62" rx="7" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    'curls'      { return '<path d="M114 144 C106 110 132 84 160 88 C188 84 214 110 206 144 C194 126 126 126 114 144 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    'receding'   { return '<path d="M120 142 C122 108 140 100 160 104 C180 100 198 108 200 142 C188 126 132 126 120 142 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    'buzz'       { return '<path d="M122 142 C122 98 198 98 198 142 C184 126 136 126 122 142 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
    default      { return '<path d="M118 146 C118 92 202 92 202 146 C188 120 132 124 118 146 Z" fill="#1E293B" stroke="#475569" stroke-width="2"/>' }
  }
}

function Get-AccessoryPath($type, $accent) {
  switch ($type) {
    'glasses'  { return "<rect x=`"132`" y=`"142`" width=`"24`" height=`"16`" rx=`"5`" fill=`"none`" stroke=`"$accent`" stroke-width=`"2.5`"/><rect x=`"164`" y=`"142`" width=`"24`" height=`"16`" rx=`"5`" fill=`"none`" stroke=`"$accent`" stroke-width=`"2.5`"/><line x1=`"156`" y1=`"149`" x2=`"164`" y2=`"149`" stroke=`"$accent`" stroke-width=`"2.5`"/>" }
    'earpiece' { return "<path d=`"M200 154 L200 204`" stroke=`"$accent`" stroke-width=`"2.5`" stroke-dasharray=`"3 3`"/><circle cx=`"200`" cy=`"154`" r=`"4`" fill=`"$accent`"/>" }
    'tie'      { return "<polygon points=`"160,214 152,256 160,270 168,256`" fill=`"$accent`" opacity=`"0.85`"/>" }
    'scarf'    { return "<path d=`"M108 220 Q160 250 212 220 L224 276 L96 276 Z`" fill=`"$accent`" fill-opacity=`"0.22`" stroke=`"$accent`" stroke-opacity=`"0.55`" stroke-width=`"2`"/>" }
    'shawl'    { return "<path d=`"M108 220 Q160 250 212 220 L224 276 L96 276 Z`" fill=`"$accent`" fill-opacity=`"0.22`" stroke=`"$accent`" stroke-opacity=`"0.55`" stroke-width=`"2`"/>" }
    'stole'    { return "<path d=`"M108 220 Q160 250 212 220 L224 276 L96 276 Z`" fill=`"$accent`" fill-opacity=`"0.22`" stroke=`"$accent`" stroke-opacity=`"0.55`" stroke-width=`"2`"/>" }
    'brooch'   { return "<circle cx=`"182`" cy=`"242`" r=`"6`" fill=`"$accent`" opacity=`"0.9`"/>" }
    'lapel'    { return "<circle cx=`"182`" cy=`"242`" r=`"6`" fill=`"$accent`" opacity=`"0.9`"/>" }
    'earrings' { return "<circle cx=`"118`" cy=`"166`" r=`"3.5`" fill=`"$accent`"/><circle cx=`"202`" cy=`"166`" r=`"3.5`" fill=`"$accent`"/>" }
    default    { return "<path d=`"M138 214 L160 236 L182 214`" fill=`"none`" stroke=`"$accent`" stroke-width=`"2.5`"/>" }
  }
}

foreach ($s in $specs) {
  $hp = Get-HairPath $s.hair
  $ap = Get-AccessoryPath $s.accessory $s.accent
  $label = "$($s.id.ToUpper())·$($s.initials)"
  $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" fill="none">
  <defs>
    <radialGradient id="rim-$($s.id)" cx="0.5" cy="0.38" r="0.58">
      <stop offset="0" stop-color="$($s.accent)" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#04070D" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="320" height="320" fill="#04070D"/>
  <rect width="320" height="320" fill="url(#rim-$($s.id))"/>
  <path d="M0 80H320M0 160H320M0 240H320M80 0V320M160 0V320M240 0V320" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1"/>
  <path d="M24 44V24H44M276 24H296V44M24 276V296H44M296 276V296H276" stroke="$($s.accent)" stroke-opacity="0.55" stroke-width="2"/>
  <path d="M64 320 C70 244 108 214 160 214 C212 214 250 244 256 320 Z" fill="#0F172A" stroke="#334155" stroke-width="2"/>
  <rect x="144" y="182" width="32" height="38" rx="12" fill="#162033"/>
  <ellipse cx="160" cy="148" rx="38" ry="46" fill="#1A263D" stroke="$($s.accent)" stroke-opacity="0.38" stroke-width="2"/>
  $hp
  <path d="M142 146 H150 M170 146 H178" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M150 172 Q160 176 170 172" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
  $ap
  <rect x="18" y="274" width="66" height="24" rx="6" fill="#020408" fill-opacity="0.85" stroke="$($s.accent)" stroke-opacity="0.5"/>
  <text x="51" y="290" text-anchor="middle" fill="#E2E8F0" font-family="monospace" font-size="11" font-weight="700">$label</text>
</svg>
"@
  [System.IO.File]::WriteAllText("$outDir\$($s.id).svg", $svg, $utf8NoBom)
}
Write-Host "Generated $($specs.Count) SVG portraits."
