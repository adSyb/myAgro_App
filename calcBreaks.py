import geojson
import numpy



with open('E:/MyAgro/admin/geojson/zones.geojson') as data_file:    
    data = geojson.load(data_file)


for property in data["features"][0]["properties"]:
	test = data["features"][0]["properties"][property]
	if isinstance(test, basestring):
		continue
	else:
		attribute = []
		for x in range(0,len(data["features"])):
			if data["features"][x]["properties"][property] < 2:
				continue
			else:
				attribute.append(data["features"][x]["properties"][property])

		index = int(round(len(attribute)/5))
		attribute.sort()

		equal = [attribute[index],attribute[(index*2)],attribute[(index*3)],attribute[(index*4)]]
		outArr = []
		
		for bucket in equal:
			bLen = len(str(bucket))
			if bLen > 5:
				out = round(bucket/10000) * 10000
			else:
				if bLen > 4:
					out = round(bucket/1000) * 1000
				else:
					if bLen > 3:
						out = round(bucket/100) * 100
					else:
						if bLen > 2:
							out = round(bucket/10) * 10
						else:
							out = bucket
			outArr.append(int(out))

		with open('E:/MyAgro/Project/data/zonebreaks.js', 'a') as f:
			f.write("var Z{} = {};\n".format(property,outArr))