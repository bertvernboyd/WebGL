$points = [];

num_subdivide = 5

v0 = [ 0.000000,  0.000000, -1.000000, 1]
v1 = [ 0.000000,  0.942809,  0.333333, 1]
v2 = [-0.816497, -0.471405,  0.333333, 1]
v3 = [ 0.816497, -0.471405,  0.333333, 1]

def mix(a, b, s)
  c = []
  a.each_index do |i|
    c[i] = s*a[i] + (1-s)*b[i]
  end
  c
end

def normalize(u)
  v = u[0..2]
  len = Math.sqrt((v.map {|e| e ** 2}).reduce :+)
  v.map! {|e| e/len}
  v[3] = 1
  v
end

def divide_triangle(a, b, c, count)
  if count > 0
    ab = mix(a, b, 0.5)
    ac = mix(a, c, 0.5)
    bc = mix(b, c, 0.5)

    ab = normalize(ab)
    ac = normalize(ac)
    bc = normalize(bc)

    divide_triangle(a, ab, ac, count - 1)
    divide_triangle(ab, b, bc, count - 1)
    divide_triangle(bc, c, ac, count - 1)
    divide_triangle(ab, bc, ac, count - 1)
  else
    $points.push(a, c, b)
  end
end

def tetrahedron(a, b, c, d, n)
  divide_triangle(a, b, c, n)
  divide_triangle(d, c, b, n)
  divide_triangle(a, d, b, n)
  divide_triangle(a, c, d, n)
end

tetrahedron(v0, v1, v2, v3, num_subdivide);

vtx = $points.uniq

indx = $points.map {|p| vtx.index(p) }

vtx.each {|v| puts "    vec3( #{v[0].abs > 1e-06 ? v[0] : 0}, #{v[1].abs > 1e-06 ? v[1] : 0}, #{v[2].abs > 1e-06 ? v[2] : 0})," }

print "    "
indx.each.with_index do |e,i|
  print "\n    " if i % 12 == 0 and i != 0
  print "#{e}, "
end
puts






