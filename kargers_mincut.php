<?php

function random_contraction($vertices, $edges)
{
    while (count($vertices) > 2) {
        $i = array_rand($edges);
        list($a, $b) = $edges[$i];
        array_splice($vertices, array_search($b, $vertices), 1);
        $new_edges = [];
        foreach ($edges as $e) {
            if ($e != [$a, $b]) {
                if (in_array($b, $e)) {
                    if ($e[0] === $b) {
                        $other = $e[1];
                    }
                    if ($e[1] === $b) {
                        $other = $e[0];
                    }
                    $e = [$a, $other];
                    sort($e);
                }
                $new_edges[] = $e;
            }
        }
        $edges = $new_edges;
    }
    $ret = [$vertices, $edges];
    return $ret;
}

$data = file('kargerMinCut.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$edges = [];
$vertices = range(1, 200);
foreach ($data as $row) {
    $row = array_filter(explode("\t", $row));
    $vert = (int)array_shift($row);
    foreach ($row as $v) {
        $edge = [$vert, (int)$v];
        sort($edge);
        if ($vert < $v) {
            $edges[implode('_', $edge)] = $edge;
        }
    }
}
$edges = array_values($edges);

$min = PHP_INT_MAX;
foreach (range(0, 100) as $i) {
    list($v, $e) = random_contraction($vertices, $edges);
    if (count($e) < $min) {
        $min = count($e);
    }
}
echo $min;

